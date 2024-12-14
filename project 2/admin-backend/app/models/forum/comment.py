from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Enum, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base
import enum

class CommentStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REMOVED = "removed"

class ForumComment(Base):
    __tablename__ = "forum_comments"

    id = Column(String, primary_key=True)
    content = Column(String, nullable=False)
    status = Column(Enum(CommentStatus), default=CommentStatus.PENDING)
    post_id = Column(String, ForeignKey("forum_posts.id"))
    author_id = Column(String, ForeignKey("users.id"))
    parent_id = Column(String, ForeignKey("forum_comments.id"), nullable=True)
    publish_date = Column(DateTime, default=datetime.utcnow)
    likes = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    post = relationship("ForumPost", back_populates="comments")
    author = relationship("User", back_populates="forum_comments")
    replies = relationship("ForumComment", backref="parent", remote_side=[id])
