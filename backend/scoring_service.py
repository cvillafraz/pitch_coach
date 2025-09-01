import os
import json
from typing import Dict, Any, Optional
from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate
from langchain.schema import BaseOutputParser
from pydantic import BaseModel, Field
import logging

logger = logging.getLogger(__name__)

class PitchScores(BaseModel):
    """Structured output model for pitch scoring"""
    tone: float = Field(
        description="Tone appropriateness (0-100): How suitable the speaker's tone is for a professional pitch",
        ge=0, le=100
    )
    fluency: float = Field(
        description="Speech fluency (0-100): How smooth and natural the speech flow is",
        ge=0, le=100
    )
    clarity: float = Field(
        description="Speech clarity (0-100): How clear and understandable the speech is",
        ge=0, le=100
    )
    confidence: float = Field(
        description="Speaker confidence (0-100): How confident the speaker appears while delivering the pitch",
        ge=0, le=100
    )
    explanation: str = Field(
        description="Brief explanation of the scoring rationale"
    )
from dotenv import load_dotenv
load_dotenv()
class PitchScoringService:
    """Service for scoring pitch performance using LLM analysis of audio expression data"""
    
    def __init__(self):
        self.api_key = os.environ.get("GROQ_API_KEY")
        if not self.api_key:
            raise ValueError("GROQ_API_KEY environment variable is required")
        
        self.llm = ChatGroq(
            model="deepseek-r1-distill-llama-70b",
            temperature=0,
            max_tokens=None,
            reasoning_format="parsed",
            timeout=None,
            max_retries=2
        )
        
        self.prompt_template = ChatPromptTemplate.from_messages([
            ("system", """You are an expert pitch coach analyzing audio expression data to score pitch performance.
            
You will receive detailed emotion analysis, transcription, and prosody data from an audio recording of a pitch presentation.

Your task is to analyze this data and provide scores (0-100) for:
1. **Tone** - How appropriate and professional the speaker's emotional tone is for a pitch
2. **Fluency** - How smooth and natural the speech flow appears based on confidence intervals and text patterns
3. **Clarity** - How clear and understandable the speech is based on confidence scores and emotion patterns
4. **Confidence** - How confident the speaker appears based on emotion analysis (low anxiety/awkwardness, high determination/enthusiasm)

Consider these factors:
- **For Tone**: Look at emotion scores like Joy, Enthusiasm, Determination vs. negative emotions
- **For Fluency**: Consider transcription confidence scores and speech pattern smoothness
- **For Clarity**: Analyze confidence scores, repetitions, and coherence in transcription
- **For Confidence**: Focus on Confidence, Determination, Enthusiasm vs. Anxiety, Awkwardness, Fear

Provide scores as integers from 0-100 and a brief explanation."""),
            ("user", """Please analyze this audio expression data and provide pitch scores:

TRANSCRIPTION:
{transcription}

OVERALL SENTIMENT:
Dominant Emotion: {dominant_emotion} (Score: {dominant_score:.2f})
Total Segments: {total_segments}

DETAILED EMOTION ANALYSIS:
{emotion_details}

CONFIDENCE METRICS:
Average Transcription Confidence: {avg_confidence:.2f}
Language Detected: {detected_language}

Please provide structured scores and explanation.""")
        ])

    async def score_pitch_performance(self, hume_results: Dict[str, Any]) -> Dict[str, Any]:
        """
        Score pitch performance based on Hume audio expression analysis results
        
        Args:
            hume_results: Results from HumeAudioService.analyze_audio_expression()
            
        Returns:
            Dict containing scores for tone, fluency, clarity, confidence and explanation
        """
        try:
            # Extract relevant data from Hume results
            analysis = hume_results.get("analysis", {})
            transcription = analysis.get("transcription", {})
            overall_sentiment = analysis.get("overall_sentiment", {})
            timestamps = analysis.get("timestamps", [])
            
            # Prepare emotion details summary
            emotion_summary = self._prepare_emotion_summary(timestamps, overall_sentiment)
            
            # Format the input for the LLM
            llm_input = {
                "transcription": transcription.get("full_text", "No transcription available"),
                "dominant_emotion": overall_sentiment.get("dominant_emotion", {}).get("name", "Unknown"),
                "dominant_score": overall_sentiment.get("dominant_emotion", {}).get("score", 0),
                "total_segments": overall_sentiment.get("total_segments_analyzed", 0),
                "emotion_details": emotion_summary,
                "avg_confidence": transcription.get("confidence", 0),
                "detected_language": transcription.get("detected_language", "Unknown")
            }
            
            # Create the chain with structured output
            chain = self.prompt_template | self.llm.with_structured_output(PitchScores)
            
            # Get structured response
            result = await chain.ainvoke(llm_input)
            
            # Convert to dict format
            scores = {
                "tone": result.tone,
                "fluency": result.fluency, 
                "clarity": result.clarity,
                "confidence": result.confidence,
                "explanation": result.explanation,
                "metadata": {
                    "model_used": "gpt-4",
                    "transcription_confidence": transcription.get("confidence", 0),
                    "dominant_emotion": overall_sentiment.get("dominant_emotion", {}),
                    "total_segments": overall_sentiment.get("total_segments_analyzed", 0)
                }
            }
            
            logger.info(f"Generated pitch scores: {scores}")
            return scores
            
        except Exception as e:
            logger.error(f"Error scoring pitch performance: {str(e)}")
            raise

    def _prepare_emotion_summary(self, timestamps: list, overall_sentiment: dict) -> str:
        """Prepare a concise summary of emotion analysis for the LLM"""
        if not timestamps:
            return "No emotion data available"
        
        # Get average emotions from overall sentiment
        avg_emotions = overall_sentiment.get("average_emotions", {})
        
        # Sort emotions by score and get top emotions
        top_emotions = sorted(avg_emotions.items(), key=lambda x: x[1], reverse=True)[:8]
        
        emotion_lines = []
        emotion_lines.append(f"Top emotions across all segments:")
        
        for emotion, score in top_emotions:
            emotion_lines.append(f"- {emotion}: {score:.2f}")
            
        # Add segment-level variability info
        if len(timestamps) > 1:
            emotion_lines.append(f"\nEmotion patterns across {len(timestamps)} segments:")
            for i, segment in enumerate(timestamps[:3]):  # Show first 3 segments
                top_segment_emotions = segment.get("emotions", [])[:3]
                emotions_str = ", ".join([f"{e['name']} ({e['score']:.2f})" for e in top_segment_emotions])
                emotion_lines.append(f"Segment {i+1}: {emotions_str}")
        
        return "\n".join(emotion_lines)

# Singleton instance
pitch_scoring_service = PitchScoringService()