import uuid
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request

class EnsureAnonID(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        uid = request.cookies.get("hireon_uid")
        if uid is None:
            uid = f"anon:{uuid.uuid4()}"  # mark as anonymous
        request.state.anon_uid = uid
        resp = await call_next(request)
        resp.set_cookie(
            "hireon_uid", uid,
            max_age=60*60*24*31, httponly=True,
            samesite="Lax", secure=True
        )
        return resp 