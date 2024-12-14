from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Table, ARRAY
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.database import Base

class Policy(Base):
    __tablename__ = "policies"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    summary = Column(String)
    category = Column(String, nullable=False)
    publish_date = Column(DateTime, default=datetime.utcnow)
    department = Column(String)
    author = Column(String)
    related_laws = Column(ARRAY(String), default=list)
    tags = Column(ARRAY(String), default=list)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class IndustryNews(Base):
    __tablename__ = "industry_news"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    summary = Column(String)
    category = Column(String, nullable=False)
    publish_date = Column(DateTime, default=datetime.utcnow)
    source = Column(String)
    author = Column(String)
    views = Column(Integer, default=0)
    tags = Column(ARRAY(String), default=list)
    image_url = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
