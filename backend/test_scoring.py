#!/usr/bin/env python3
"""
Test script for the pitch scoring service
"""
import asyncio
import json
from scoring_service import pitch_scoring_service

# Mock Hume results for testing
mock_hume_results = {
    "success": True,
    "analysis": {
        "transcription": {
            "full_text": "Hello everyone. I'm excited to present our innovative AI-powered solution that will revolutionize the way businesses handle customer service. Our platform uses advanced machine learning to provide instant, accurate responses while maintaining a personal touch.",
            "confidence": 0.85,
            "detected_language": "en"
        },
        "overall_sentiment": {
            "dominant_emotion": {
                "name": "Enthusiasm",
                "score": 0.72
            },
            "average_emotions": {
                "Enthusiasm": 0.72,
                "Confidence": 0.65,
                "Interest": 0.58,
                "Joy": 0.45,
                "Determination": 0.42,
                "Anxiety": 0.15,
                "Awkwardness": 0.12
            },
            "total_segments_analyzed": 3
        },
        "timestamps": [
            {
                "text": "Hello everyone.",
                "confidence": 0.95,
                "timestamp": {"begin": 0.5, "end": 1.2},
                "emotions": [
                    {"name": "Joy", "score": 0.8},
                    {"name": "Enthusiasm", "score": 0.7},
                    {"name": "Confidence", "score": 0.6}
                ]
            },
            {
                "text": "I'm excited to present our innovative AI-powered solution",
                "confidence": 0.88,
                "timestamp": {"begin": 1.5, "end": 4.2},
                "emotions": [
                    {"name": "Enthusiasm", "score": 0.85},
                    {"name": "Excitement", "score": 0.75},
                    {"name": "Determination", "score": 0.65}
                ]
            },
            {
                "text": "that will revolutionize the way businesses handle customer service.",
                "confidence": 0.82,
                "timestamp": {"begin": 4.5, "end": 8.1},
                "emotions": [
                    {"name": "Confidence", "score": 0.78},
                    {"name": "Determination", "score": 0.72},
                    {"name": "Interest", "score": 0.68}
                ]
            }
        ]
    }
}

async def test_pitch_scoring():
    """Test the pitch scoring functionality"""
    try:
        print("Testing Pitch Scoring Service...")
        print("=" * 50)
        
        # Test scoring with mock data
        scores = await pitch_scoring_service.score_pitch_performance(mock_hume_results)
        
        print("Pitch Performance Scores:")
        print(f"Tone: {scores['tone']}/100")
        print(f"Fluency: {scores['fluency']}/100")  
        print(f"Clarity: {scores['clarity']}/100")
        print(f"Confidence: {scores['confidence']}/100")
        print(f"\nExplanation: {scores['explanation']}")
        
        print(f"\nMetadata:")
        print(f"Model used: {scores['metadata']['model_used']}")
        print(f"Transcription confidence: {scores['metadata']['transcription_confidence']}")
        print(f"Dominant emotion: {scores['metadata']['dominant_emotion']}")
        
        print("\n" + "=" * 50)
        print("✅ Test completed successfully!")
        
        return scores
        
    except Exception as e:
        print(f"❌ Test failed with error: {str(e)}")
        raise

if __name__ == "__main__":
    # Note: This requires OPENAI_API_KEY environment variable to be set
    asyncio.run(test_pitch_scoring())