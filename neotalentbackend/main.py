from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, summarize, translate, calories

app = FastAPI(title="Neotalent AI Services")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(summarize.router, prefix="/summarize", tags=["Summarization"])
app.include_router(translate.router, prefix="/translate", tags=["Translation"])
app.include_router(calories.router, prefix="/calories", tags=["CalorieEstimation"])
