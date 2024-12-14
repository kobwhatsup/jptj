from fastapi import Request, HTTPException
from datetime import datetime, timedelta
from typing import Dict, Tuple, Callable
from starlette.responses import JSONResponse
import time

class RateLimiter:
    def __init__(self, requests_per_minute: int = 5):
        self.requests_per_minute = requests_per_minute
        self.requests: Dict[str, list] = {}

    async def __call__(self, request: Request, call_next: Callable):
        try:
            if request.url.path == "/api/v1/admin/login":
                ip = request.client.host
                now = datetime.now()

                # Initialize or clean old requests
                if ip not in self.requests:
                    self.requests[ip] = []
                self.requests[ip] = [req_time for req_time in self.requests[ip]
                                   if now - req_time < timedelta(minutes=1)]

                # Check rate limit
                if len(self.requests[ip]) >= self.requests_per_minute:
                    return JSONResponse(
                        status_code=429,
                        content={"detail": "Too many login attempts. Please try again later."}
                    )

                # Add current request
                self.requests[ip].append(now)

            # Continue processing the request
            response = await call_next(request)
            return response
        except Exception as e:
            return JSONResponse(
                status_code=500,
                content={"detail": "Internal server error"}
            )
