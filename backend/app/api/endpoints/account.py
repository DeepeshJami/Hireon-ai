from fastapi import APIRouter, Depends
from .analysis import optional_google_user, get_usage

router = APIRouter()

@router.get("/me")
async def me(google_uid: str = Depends(optional_google_user)):
    if not google_uid:
        return {"error": "Not authenticated"}
    used = await get_usage(google_uid)
    return {"used": used, "limit": 20} 