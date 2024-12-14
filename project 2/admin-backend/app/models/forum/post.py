from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Enum, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base
import enum

class ForumCategory(str, enum.Enum):
    EXPERIENCE = "EXPERIENCE"  # 经验交流
    CASE = "CASE"             # 案例分享
    SKILL = "SKILL"           # 技能提升
    POLICY = "POLICY"         # 政策讨论
    INSIGHT = "INSIGHT"       # 调解心得

class PostStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REMOVED = "removed"

class ForumPost(Base):
    __tablename__ = "forum_posts"

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    summary = Column(String)
    category = Column(Enum(ForumCategory), nullable=False)
    status = Column(Enum(PostStatus), default=PostStatus.PENDING)
    author_id = Column(String, ForeignKey("users.id"))
    publish_date = Column(DateTime, default=datetime.utcnow)
    views = Column(Integer, default=0)
    likes = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    author = relationship("User", back_populates="forum_posts")
    comments = relationship("ForumComment", back_populates="post", cascade="all, delete-orphan")
