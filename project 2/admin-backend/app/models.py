from datetime import datetime
from uuid import uuid4
from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Boolean, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class Admin(Base):
    __tablename__ = "admins"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    username = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    role = Column(String, nullable=False)  # mediator, expert, user
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Content(Base):
    __tablename__ = "contents"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    type = Column(String, nullable=False)  # policy, news
    category = Column(String, nullable=False)
    author = Column(String, nullable=False)
    publish_date = Column(DateTime, default=datetime.utcnow)
    is_published = Column(Boolean, default=False)

class ForumPost(Base):
    __tablename__ = "forum_posts"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    author_id = Column(String, ForeignKey("users.id"))
    category = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_pinned = Column(Boolean, default=False)
    is_locked = Column(Boolean, default=False)
    view_count = Column(Integer, default=0)

    author = relationship("User", backref="posts")
    comments = relationship("ForumComment", backref="post", cascade="all, delete-orphan")

class ForumComment(Base):
    __tablename__ = "forum_comments"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    content = Column(Text, nullable=False)
    author_id = Column(String, ForeignKey("users.id"))
    post_id = Column(String, ForeignKey("forum_posts.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    is_hidden = Column(Boolean, default=False)

    author = relationship("User", backref="comments")
