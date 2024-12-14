from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.forum.comment import CommentStatus

class ForumCommentBase(BaseModel):
    content: str
    post_id: str
    parent_id: Optional[str] = None

class ForumCommentCreate(ForumCommentBase):
    author_id: str

class ForumCommentUpdate(BaseModel):
    content: Optional[str] = None
    status: Optional[CommentStatus] = None

class ForumCommentResponse(ForumCommentBase):
    id: str
    status: CommentStatus
    author_id: str
    publish_date: datetime
    likes: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ForumCommentList(BaseModel):
    total: int
    items: List[ForumCommentResponse]
    page: int
    size: int

class ForumCommentTree(ForumCommentResponse):
    replies: List['ForumCommentTree'] = []

    class Config:
        from_attributes = True
