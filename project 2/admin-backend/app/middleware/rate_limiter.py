from fastapi import Request, HTTPException
from fastapi.middleware.base import BaseHTTPMiddleware
from datetime import datetime, timedelta
from typing import Dict, Callable
from starlette.responses import JSONResponse
import time
import logging

logger = logging.getLogger(__name__)

class RateLimiter(BaseHTTPMiddleware):
    def __init__(self, app, requests_per_minute: int = 60):  # Increased from 30 to 60
        super().__init__(app)
        self.requests_per_minute = requests_per_minute
        self.requests: Dict[str, list] = {}
        self.whitelist = ['127.0.0.1', 'localhost']  # Add whitelist for admin IPs
        logger.info(f"Rate limiter initialized: {requests_per_minute} requests per minute")

    async def dispatch(self, request: Request, call_next: Callable):
        try:
            ip = request.client.host

            # Skip rate limiting for whitelisted IPs
            if ip in self.whitelist:
                return await call_next(request)

            now = datetime.now()

            # Initialize or clean old requests
            if ip not in self.requests:
                self.requests[ip] = []
            self.requests[ip] = [req_time for req_time in self.requests[ip]
                               if now - req_time < timedelta(minutes=1)]

            # Check rate limit
            if len(self.requests[ip]) >= self.requests_per_minute:
                logger.warning(f"Rate limit exceeded for IP: {ip}")
                return JSONResponse(
                    status_code=429,
                    content={"detail": "请求过于频繁，请稍后再试"}  # Too many requests, please try again later
                )

            # Add current request
            self.requests[ip].append(now)

            # Continue processing the request
            response = await call_next(request)
            return response
        except Exception as e:
            logger.error(f"Rate limiter error: {str(e)}")
            return JSONResponse(
                status_code=500,
                content={"detail": "服务器内部错误"}  # Internal server error
            )
