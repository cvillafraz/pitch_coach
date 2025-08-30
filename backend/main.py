from fastapi import FastAPI, Depends, UploadFile, File, Form, HTTPException
from auth import verify_supabase_jwt
from fastapi.middleware.cors import CORSMiddleware
from hume_service import hume_service
import logging

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your needs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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