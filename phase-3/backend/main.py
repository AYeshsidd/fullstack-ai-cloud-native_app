from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.v1 import todos, auth, chat
from core.config import settings


# Create FastAPI app instance
app = FastAPI(
    title="Todo API",
    description="API for managing todo tasks with user authentication and authorization",
    version="1.0.0"
)

# Add CORS middleware for security
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    # Add any additional security headers as needed
)

# Include API routers
app.include_router(auth.router)
app.include_router(todos.router)
app.include_router(chat.router)


@app.get("/")
def read_root():
    """
    Root endpoint for health check.

    Returns:
        dict: Welcome message and API status
    """
    return {
        "message": "Welcome to the Todo API",
        "status": "running",
        "version": "1.0.0"
    }


@app.get("/health")
def health_check():
    """
    Health check endpoint.

    Returns:
        dict: Health status of the API
    """
    return {
        "status": "healthy",
        "service": "Todo API",
        "timestamp": __import__('datetime').datetime.now().isoformat()
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True if settings.db_echo_enabled else False,
        log_level="info"
    )