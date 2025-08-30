from fastapi import FastAPI, Depends
from auth import verify_supabase_jwt
from fastapi.middleware.cors import CORSMiddleware

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