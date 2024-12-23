from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.forum.post import ForumCategory, PostStatus

class ForumPostBase(BaseModel):
    title: str
    content: str
    summary: Optional[str] = None
    category: ForumCategory

class ForumPostCreate(ForumPostBase):
    author_id: str  # Add author_id field

class ForumPostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    summary: Optional[str] = None
    category: Optional[ForumCategory] = None
    status: Optional[PostStatus] = None

class ForumPostResponse(ForumPostBase):
    id: str
    status: PostStatus
    author_id: str
    publish_date: Optional[datetime] = None  # Make optional
    views: int = 0  # Add default value
    likes: int = 0  # Add default value
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ForumPostList(BaseModel):
    total: int
    items: List[ForumPostResponse]
    page: int
    size: int
