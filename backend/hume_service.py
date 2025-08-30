import asyncio
import os
import tempfile
import time
from typing import Dict, Any, Optional, BinaryIO
from hume import HumeClient
from hume.expression_measurement.batch import Prosody, Models, Language
from hume.expression_measurement.batch.types import InferenceBaseRequest
import logging

logger = logging.getLogger(__name__)

class HumeAudioService:
    """Service for analyzing audio expression using Hume AI"""
    
    def __init__(self):
        self.api_key = os.environ.get("HUME_API_KEY")
        if not self.api_key:
            raise ValueError("HUME_API_KEY environment variable is required")
        
        self.client = HumeClient(api_key=self.api_key)
    
    async def analyze_audio_expression(
        self, 
        audio_file: BinaryIO, 
        timeout_seconds: int = 300
    ) -> Dict[str, Any]:
        """
        Analyze audio file for expression measurement
        
        Args:
            audio_file: Binary audio file data
            timeout_seconds: Maximum time to wait for results
            
        Returns:
            Dict containing expression analysis results
        """
        try:
            # Create prosody configuration for audio analysis
            prosody_config = Prosody()
            models_chosen = Models(prosody=prosody_config, language=Language())
            
            # Create inference request configuration
            inference_request = InferenceBaseRequest(models=models_chosen)
            
            # Start inference job
            job_id = self.client.expression_measurement.batch.start_inference_job_from_local_file(
                json=inference_request,
                file=[audio_file]
            )
            
            logger.info(f"Started Hume analysis job: {job_id}")
            
            # Poll for results
            results = await self._wait_for_results(job_id, timeout_seconds)
            
            # Process and return the results
            processed = self._process_results(results)
            logger.critical(f"Processed Hume results: {processed}")
            return processed
            
        except Exception as e:
            logger.error(f"Error analyzing audio with Hume: {str(e)}")
            raise
    
    async def _wait_for_results(self, job_id: str, timeout_seconds: int) -> Dict[str, Any]:
        """Wait for job completion and return results"""
        start_time = time.time()
        
        while time.time() - start_time < timeout_seconds:
            try:
                # Get job details
                job_details = self.client.expression_measurement.batch.get_job_details(job_id)
                
                if job_details.state.status == "COMPLETED":
                    # Get job predictions/results
                    predictions = self.client.expression_measurement.batch.get_job_predictions(job_id)
                    return predictions
                elif job_details.state.status == "FAILED":
                    error_msg = getattr(job_details.state, 'message', 'Unknown error')
                    raise Exception(f"Hume job failed: {error_msg}")
                
                # Wait before polling again
                await asyncio.sleep(2)
                
            except Exception as e:
                logger.error(f"Error polling job {job_id}: {str(e)}")
                raise
        
        raise TimeoutError(f"Hume analysis timed out after {timeout_seconds} seconds")
    
    def _process_results(self, results) -> Dict[str, Any]:
        """Process raw Hume results into a structured format"""
        processed_results = {
            "success": True,
            "analysis": {
                "emotions": [],
                "overall_sentiment": {},
                "timestamps": [],
                "transcription": {
                    "full_text": "",
                    "confidence": 0,
                    "detected_language": ""
                }
            },
            "metadata": {
                "processing_time": None,
                "confidence_scores": []
            }
        }
        
        try:
            logger.info(f"Processing Hume results: {type(results)}")
            
            # Results is a list of InferenceSourcePredictResult objects
            if not results:
                logger.warning("No results found from Hume API")
                return processed_results
            
            # Track transcription data
            full_text_segments = []
            transcription_confidence_total = 0
            transcription_segment_count = 0
            detected_language = ""
            
            # Process each result
            for result in results:
                # Access the results attribute which contains InferenceResults
                inference_results = result.results
                predictions = inference_results.predictions
                
                # Process each prediction
                for prediction in predictions:
                    models = prediction.models
                    
                    # Check if prosody data is available
                    if models.prosody:
                        prosody_data = models.prosody
                        
                        # Extract transcription metadata if available
                        if hasattr(prosody_data, 'metadata') and prosody_data.metadata:
                            metadata = prosody_data.metadata
                            if hasattr(metadata, 'detected_language'):
                                detected_language = metadata.detected_language
                        
                        # Process grouped predictions
                        if hasattr(prosody_data, 'grouped_predictions'):
                            for group in prosody_data.grouped_predictions:
                                for pred in group.predictions:
                                    # Extract emotion scores
                                    emotions = []
                                    if hasattr(pred, 'emotions'):
                                        emotions = [
                                            {"name": emotion.name, "score": emotion.score}
                                            for emotion in pred.emotions
                                        ]
                                    
                                    # Get timestamp info
                                    time_begin = pred.time.begin if hasattr(pred, 'time') else 0
                                    time_end = pred.time.end if hasattr(pred, 'time') else 0
                                    
                                    # Get transcription text and confidence
                                    text = getattr(pred, 'text', '')
                                    confidence = getattr(pred, 'confidence', 0)
                                    
                                    # Add to transcription tracking
                                    if text:
                                        full_text_segments.append(text)
                                        transcription_confidence_total += confidence
                                        transcription_segment_count += 1
                                    
                                    segment_data = {
                                        "text": text,
                                        "confidence": confidence,
                                        "timestamp": {
                                            "begin": time_begin,
                                            "end": time_end
                                        },
                                        "emotions": self._extract_top_emotions(emotions),
                                        "all_emotions": emotions
                                    }
                                    
                                    processed_results["analysis"]["timestamps"].append(segment_data)
            
            # Calculate overall sentiment
            processed_results["analysis"]["overall_sentiment"] = self._calculate_overall_sentiment(
                processed_results["analysis"]["timestamps"]
            )
            
        except Exception as e:
            logger.error(f"Error processing Hume results: {str(e)}")
            processed_results["success"] = False
            processed_results["error"] = str(e)
        
        return processed_results
    
    def _extract_top_emotions(self, emotions: list, top_n: int = 5) -> list:
        """Extract top N emotions by score"""
        if not emotions:
            return []
        
        # Sort emotions by score (descending)
        sorted_emotions = sorted(emotions, key=lambda x: x["score"], reverse=True)
        
        return sorted_emotions[:top_n]
    
    def _calculate_overall_sentiment(self, timestamps: list) -> Dict[str, Any]:
        """Calculate overall sentiment from all timestamps"""
        if not timestamps:
            return {}
        
        emotion_totals = {}
        total_segments = len(timestamps)
        
        # Aggregate emotion scores across all segments
        for segment in timestamps:
            for emotion in segment.get("emotions", []):
                name = emotion["name"]
                score = emotion["score"]
                
                if name in emotion_totals:
                    emotion_totals[name] += score
                else:
                    emotion_totals[name] = score
        
        # Calculate averages
        avg_emotions = {
            name: total / total_segments 
            for name, total in emotion_totals.items()
        }
        
        # Find dominant emotion
        dominant_emotion = max(avg_emotions.items(), key=lambda x: x[1]) if avg_emotions else ("neutral", 0)
        
        return {
            "dominant_emotion": {
                "name": dominant_emotion[0],
                "score": dominant_emotion[1]
            },
            "average_emotions": avg_emotions,
            "total_segments_analyzed": total_segments
        }

# Singleton instance
hume_service = HumeAudioService()