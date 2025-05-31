from fastapi import APIRouter, Depends
from .analysis import optional_google_user

router = APIRouter()

@router.get("/me")
async def me(google_uid: str = Depends(optional_google_user)):
    return {"free": True} 