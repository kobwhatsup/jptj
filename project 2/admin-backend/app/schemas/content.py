from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class PolicyBase(BaseModel):
    title: str
    content: str
    summary: Optional[str] = None
    category: str
    department: Optional[str] = None
    author: Optional[str] = None
    related_laws: Optional[List[str]] = []
    tags: Optional[List[str]] = []

class PolicyCreate(PolicyBase):
    pass

class PolicyUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    summary: Optional[str] = None
    category: Optional[str] = None
    department: Optional[str] = None
    author: Optional[str] = None
    related_laws: Optional[List[str]] = None
    tags: Optional[List[str]] = None

class PolicyInDB(PolicyBase):
    id: str
    publish_date: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PolicyResponse(PolicyInDB):
    pass

class PolicyList(BaseModel):
    total: int
    items: List[PolicyResponse]
    page: int
    size: int

class IndustryNewsBase(BaseModel):
    title: str
    content: str
    summary: Optional[str] = None
    category: str
    source: Optional[str] = None
    author: Optional[str] = None
    tags: Optional[List[str]] = []
    image_url: Optional[str] = None

class IndustryNewsCreate(IndustryNewsBase):
    pass

class IndustryNewsUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    summary: Optional[str] = None
    category: Optional[str] = None
    source: Optional[str] = None
    author: Optional[str] = None
    tags: Optional[List[str]] = None
    image_url: Optional[str] = None

class IndustryNewsInDB(IndustryNewsBase):
    id: str
    publish_date: datetime
    views: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class IndustryNewsResponse(IndustryNewsInDB):
    pass

class IndustryNewsList(BaseModel):
    total: int
    items: List[IndustryNewsResponse]
    page: int
    size: int
