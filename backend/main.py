"""
SwanyThree Ultimate Platform - Backend API
FastAPI application with AI Agent orchestration, authentication, and data management
"""

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZIPMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from contextlib import asynccontextmanager
import logging
import time

from api.routes import auth, agents, content, users, workflows, teams, analytics
from api.middleware import RateLimitMiddleware, LoggingMiddleware
from services.database import init_db, close_db
from services.redis_client import init_redis, close_redis
from services.vector_store import init_vector_store, close_vector_store
from utils.config import settings
from utils.logger import setup_logging

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    # Startup
    logger.info("Starting SwanyThree Ultimate Platform API")

    # Initialize database
    await init_db()
    logger.info("Database initialized")

    # Initialize Redis
    await init_redis()
    logger.info("Redis initialized")

    # Initialize vector store
    await init_vector_store()
    logger.info("Vector store initialized")

    yield

    # Shutdown
    logger.info("Shutting down SwanyThree Ultimate Platform API")
    await close_vector_store()
    await close_redis()
    await close_db()

# Create FastAPI app
app = FastAPI(
    title="SwanyThree Ultimate Platform API",
    description="AI-Powered Automation and Orchestration Platform",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-RateLimit-Limit", "X-RateLimit-Remaining", "X-RateLimit-Reset"],
)

# GZIP Compression
app.add_middleware(GZIPMiddleware, minimum_size=1000)

# Custom Middleware
app.add_middleware(RateLimitMiddleware)
app.add_middleware(LoggingMiddleware)

# Exception Handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors"""
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Invalid request data",
                "details": exc.errors(),
            }
        },
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle general exceptions"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "code": "INTERNAL_ERROR",
                "message": "An internal error occurred",
            }
        },
    )

# Health Check
@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "timestamp": time.time(),
    }

# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """Root endpoint"""
    return {
        "name": "SwanyThree Ultimate Platform API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/api/docs",
    }

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(agents.router, prefix="/api/agents", tags=["AI Agents"])
app.include_router(content.router, prefix="/api/content", tags=["Content"])
app.include_router(workflows.router, prefix="/api/workflows", tags=["Workflows"])
app.include_router(teams.router, prefix="/api/teams", tags=["Teams"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="info",
    )
