from fastapi import FastAPI, Depends, UploadFile, File, Form, HTTPException, Request
from auth import verify_supabase_jwt
from fastapi.middleware.cors import CORSMiddleware
from hume_service import hume_service
from scoring_service import pitch_scoring_service
import logging
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import Optional, Dict, Any
import hmac
import hashlib
import os
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your needs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Farcaster webhook models
class FarcasterUser(BaseModel):
    fid: int
    username: Optional[str] = None
    display_name: Optional[str] = None
    pfp_url: Optional[str] = None

class FarcasterFrameAction(BaseModel):
    type: str  # "frame_added", "frame_removed", "button_pressed", etc.
    frame_url: str
    button_index: Optional[int] = None
    input_text: Optional[str] = None
    user: FarcasterUser
    timestamp: str

class FarcasterWebhookPayload(BaseModel):
    action: FarcasterFrameAction
    signature: Optional[str] = None

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/protected")
def protected_route(user=Depends(verify_supabase_jwt)):
    return {"message": "You are authenticated!", "user": user}

@app.get("/dashboard")
def get_dashboard_data():
    return {
        "user": {
            "name": "Alexa Johnson",
            "joinDate": "2024-01-01",
            "currentStreak": 7,
            "level": "Intermediate",
        },
        "quickStats": {
            "totalSessions": 24,
            "averageScore": 76,
            "practiceTime": 14400,  # seconds
            "improvement": 12,  # percentage
        },
        "recentSessions": [
            {
                "id": 1,
                "date": "2024-01-15",
                "persona": "Sarah Chen",
                "score": 78,
                "duration": 420,
                "type": "VC Investor",
            },
            {
                "id": 2,
                "date": "2024-01-14",
                "persona": "Michael Rodriguez",
                "score": 72,
                "duration": 380,
                "type": "Angel Investor",
            },
            {
                "id": 3,
                "date": "2024-01-12",
                "persona": "Jennifer Park",
                "score": 81,
                "duration": 450,
                "type": "Corporate Customer",
            },
        ],
        # Add other fields as needed from the mockDashboardData
    }

@app.post("/analyze-audio")
async def analyze_audio_expression(
    audio: UploadFile = File(...),
    duration: str = Form(None),
    timestamp: str = Form(None),
    size: str = Form(None),
    type: str = Form(None),
    analysisType: str = Form(None)
):
    """
    Analyze audio file for emotional expression using Hume AI
    
    Accepts audio files and returns expression measurement data
    """
    try:
        # Validate file type
        if not audio.content_type or not audio.content_type.startswith('audio/'):
            raise HTTPException(
                status_code=400, 
                detail="Invalid file type. Please upload an audio file."
            )
        
        # Check file size (limit to 50MB)
        max_size = 50 * 1024 * 1024  # 50MB in bytes
        content = await audio.read()
        
        if len(content) > max_size:
            raise HTTPException(
                status_code=413,
                detail="File too large. Maximum size is 50MB."
            )
        
        # Reset file pointer for processing
        await audio.seek(0)
        
        # Analyze audio with Hume service
        analysis_result = await hume_service.analyze_audio_expression(audio.file)
        
        
        return {
            "success": True,
            "filename": audio.filename,
            "content_type": audio.content_type,
            "file_size": len(content),
            "duration": duration,
            "timestamp": timestamp,
            "analysisType": analysisType,
            "analysis": analysis_result
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error analyzing audio: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to analyze audio: {str(e)}"
        )

@app.get("/audio-analysis/{job_id}")
async def get_audio_analysis_status(
    job_id: str,
    user=Depends(verify_supabase_jwt)
):
    """
    Get the status of an audio analysis job
    """
    try:
        # This could be extended to track job status in a database
        return {
            "job_id": job_id,
            "status": "This endpoint can be extended for async job tracking",
            "user_id": user.get("sub")
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get analysis status: {str(e)}"
        )

@app.post("/analyze-pitch")
async def analyze_pitch_performance(
    audio: UploadFile = File(...),
    duration: str = Form(None),
    timestamp: str = Form(None),
    size: str = Form(None),
    type: str = Form(None)
):
    """
    Comprehensive pitch analysis: emotion analysis + AI scoring
    
    Combines Hume AI emotion analysis with LLM-based scoring for:
    - Tone appropriateness
    - Speech fluency 
    - Clarity
    - Speaker confidence
    """
    try:
        # Validate file type
        if not audio.content_type or not audio.content_type.startswith('audio/'):
            raise HTTPException(
                status_code=400, 
                detail="Invalid file type. Please upload an audio file."
            )
        
        # Check file size (limit to 50MB)
        max_size = 50 * 1024 * 1024  # 50MB in bytes
        content = await audio.read()
        
        if len(content) > max_size:
            raise HTTPException(
                status_code=413,
                detail="File too large. Maximum size is 50MB."
            )
        
        # Reset file pointer for processing
        await audio.seek(0)
        
        # Step 1: Analyze audio with Hume service
        logging.info("Starting Hume audio expression analysis...")
        hume_results = await hume_service.analyze_audio_expression(audio.file)
        
        if not hume_results.get("success"):
            raise HTTPException(
                status_code=500,
                detail="Audio expression analysis failed"
            )
        
        # Step 2: Generate pitch scores using LLM
        logging.info("Generating pitch performance scores...")
        pitch_scores = await pitch_scoring_service.score_pitch_performance(hume_results)
        logging.critical(f"Pitch scores generated: {pitch_scores}")
        
        return {
            "success": True,
            "filename": audio.filename,
            "content_type": audio.content_type,
            "file_size": len(content),
            "duration": duration,
            "timestamp": timestamp,
            "transcription": hume_results["analysis"]["transcription"]["full_text"],
            "emotion_analysis": {
                "dominant_emotion": hume_results["analysis"]["overall_sentiment"]["dominant_emotion"],
                "total_segments": hume_results["analysis"]["overall_sentiment"]["total_segments_analyzed"],
                "confidence": hume_results["analysis"]["transcription"]["confidence"]
            },
            "pitch_scores": pitch_scores,
            "raw_analysis": hume_results  # Include full Hume results for detailed analysis
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error analyzing pitch performance: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to analyze pitch: {str(e)}"
        )

@app.post("/farcaster/webhook")
async def farcaster_webhook(request: Request):
    """
    Webhook endpoint for Farcaster mini app notifications
    
    Handles various Farcaster frame events like:
    - Frame interactions (button clicks, text input)
    - Frame additions/removals
    - User engagement events
    """
    try:
        # Get raw body for signature validation
        body = await request.body()
        
        # Verify webhook signature if configured
        farcaster_webhook_secret = os.getenv("FARCASTER_WEBHOOK_SECRET")
        if farcaster_webhook_secret:
            signature = request.headers.get("x-farcaster-signature")
            if not signature or not verify_farcaster_signature(body, signature, farcaster_webhook_secret):
                raise HTTPException(
                    status_code=401,
                    detail="Invalid webhook signature"
                )
        
        # Parse the JSON payload
        import json
        try:
            payload_data = json.loads(body.decode('utf-8'))
        except json.JSONDecodeError:
            raise HTTPException(
                status_code=400,
                detail="Invalid JSON payload"
            )
        
        # Validate payload structure
        try:
            payload = FarcasterWebhookPayload(**payload_data)
        except Exception as validation_error:
            logging.warning(f"Webhook payload validation failed: {validation_error}")
            # Still process the webhook but log the validation issue
            payload = None
        
        # Log the webhook event
        logging.info(f"Farcaster webhook received: {payload_data.get('action', {}).get('type', 'unknown')}")
        
        # Process different types of webhook events
        action_type = payload_data.get('action', {}).get('type', 'unknown')
        user_fid = payload_data.get('action', {}).get('user', {}).get('fid')
        
        if action_type == "button_pressed":
            # Handle button press events
            button_index = payload_data.get('action', {}).get('button_index')
            frame_url = payload_data.get('action', {}).get('frame_url')
            input_text = payload_data.get('action', {}).get('input_text', '')
            
            logging.info(f"User {user_fid} pressed button {button_index} on frame {frame_url}")
            
            # Add custom logic here for button interactions
            response_data = {
                "status": "processed",
                "action": "button_pressed",
                "message": f"Button {button_index} interaction recorded"
            }
            
        elif action_type == "frame_added":
            # Handle when user adds the frame/app
            logging.info(f"User {user_fid} added frame to their app")
            
            response_data = {
                "status": "processed", 
                "action": "frame_added",
                "message": "Frame addition recorded"
            }
            
        elif action_type == "frame_removed":
            # Handle when user removes the frame/app
            logging.info(f"User {user_fid} removed frame from their app")
            
            response_data = {
                "status": "processed",
                "action": "frame_removed", 
                "message": "Frame removal recorded"
            }
            
        else:
            # Handle unknown or custom event types
            logging.info(f"Unknown webhook action type: {action_type}")
            
            response_data = {
                "status": "processed",
                "action": action_type,
                "message": "Event logged"
            }
        
        # Store webhook data (add database integration as needed)
        # await store_webhook_event(payload_data)
        
        return {
            "success": True,
            "timestamp": payload_data.get('action', {}).get('timestamp'),
            "processed": response_data
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error processing Farcaster webhook: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process webhook: {str(e)}"
        )

def verify_farcaster_signature(body: bytes, signature: str, secret: str) -> bool:
    """
    Verify webhook signature using HMAC-SHA256
    """
    try:
        # Expected signature format: "sha256=<hash>"
        if not signature.startswith("sha256="):
            return False
            
        expected_signature = signature[7:]  # Remove "sha256=" prefix
        
        # Compute HMAC-SHA256
        computed_hash = hmac.new(
            secret.encode('utf-8'),
            body,
            hashlib.sha256
        ).hexdigest()
        
        # Use constant-time comparison to prevent timing attacks
        return hmac.compare_digest(expected_signature, computed_hash)
        
    except Exception as e:
        logging.error(f"Error verifying webhook signature: {e}")
        return False