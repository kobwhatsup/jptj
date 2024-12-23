from fastapi import Request, Response
from fastapi.middleware.base import BaseHTTPMiddleware
import time
import logging
from typing import Callable

logger = logging.getLogger(__name__)

class PerformanceMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        start_time = time.time()

        try:
            response = await call_next(request)
            process_time = (time.time() - start_time) * 1000  # Convert to milliseconds

            logger.info(
                f"Request Performance | "
                f"Path: {request.url.path} | "
                f"Method: {request.method} | "
                f"Time: {process_time:.2f}ms | "
                f"Status: {response.status_code}"
            )

            # Add processing time header
            response.headers["X-Process-Time"] = f"{process_time:.2f}ms"
            return response

        except Exception as e:
            process_time = (time.time() - start_time) * 1000
            logger.error(
                f"Request Failed | "
                f"Path: {request.url.path} | "
                f"Method: {request.method} | "
                f"Time: {process_time:.2f}ms | "
                f"Error: {str(e)}"
            )
            raise
