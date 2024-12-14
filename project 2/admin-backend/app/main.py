from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
import logging
from .config import settings
from .api.auth import router as auth_router
from .api.users import router as users_router
from .api.content import router as content_router
from .api.forum.moderation import router as forum_router
from .api.dashboard import router as dashboard_router
from .middleware.rate_limiter import RateLimiter
import uvicorn

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    debug=True  # Enable debug mode for detailed error messages
)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Development frontend
        "https://run-project-app-7kc8414b.devinapps.com",  # Current production frontend
        "https://run-project-app-tunnel-iu4gwk03.devinapps.com",  # Development tunnel frontend
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],  # Specific allowed methods
    allow_headers=["Authorization", "Content-Type"],  # Specific allowed headers
)

# Add rate limiting middleware
app.middleware("http")(RateLimiter())

# Include routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(users_router, prefix=f"{settings.API_V1_STR}/admin")
app.include_router(content_router, prefix=f"{settings.API_V1_STR}/admin")
app.include_router(forum_router, prefix=f"{settings.API_V1_STR}/admin")
app.include_router(dashboard_router, prefix=f"{settings.API_V1_STR}/admin")

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
