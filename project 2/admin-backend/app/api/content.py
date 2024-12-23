from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import uuid
import traceback

from app.database import get_db
from app.models.content import Policy, IndustryNews
from app.schemas.content import (
    PolicyCreate, PolicyUpdate, PolicyResponse, PolicyList,
    IndustryNewsCreate, IndustryNewsUpdate, IndustryNewsResponse, IndustryNewsList
)
from app.api.auth import get_current_admin

router = APIRouter(tags=["content"])

# Combined content endpoint for admin dashboard
@router.get("/content", response_model=dict)
async def get_all_content(
    page: int = Query(1, gt=0),
    size: int = Query(10, gt=0, le=100),
    content_type: Optional[str] = None,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin)
):
    try:
        # Get policies
        policies_query = db.query(Policy)
        total_policies = policies_query.count()
        policies = policies_query.order_by(Policy.publish_date.desc()).offset((page - 1) * size).limit(size).all()

        # Get industry news
        news_query = db.query(IndustryNews)
        total_news = news_query.count()
        news = news_query.order_by(IndustryNews.publish_date.desc()).offset((page - 1) * size).limit(size).all()

        # Convert SQLAlchemy models to dictionaries with explicit field mapping
        policies_data = [{
            "id": policy.id,
            "title": policy.title,
            "content": policy.content,
            "publish_date": policy.publish_date.isoformat() if policy.publish_date else None,
            "tags": policy.tags,
            "related_laws": policy.related_laws
        } for policy in policies]

        news_data = [{
            "id": news.id,
            "title": news.title,
            "content": news.content,
            "publish_date": news.publish_date.isoformat() if news.publish_date else None,
            "source": news.source,
            "category": news.category
        } for news in news]

        return {
            "policies": {
                "total": total_policies,
                "items": policies_data,
                "page": page,
                "size": size
            },
            "industry_news": {
                "total": total_news,
                "items": news_data,
                "page": page,
                "size": size
            }
        }
    except Exception as e:
        error_details = {
            "error": str(e),
            "traceback": traceback.format_exc()
        }
        print(f"Error in get_all_content: {error_details}")
        raise HTTPException(status_code=500, detail=error_details)

# Policy endpoints
@router.get("/policies", response_model=PolicyList)
async def list_policies(
    page: int = Query(1, gt=0),
    size: int = Query(10, gt=0, le=100),
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin)
):
    query = db.query(Policy)

    if category:
        query = query.filter(Policy.category == category)
    if search:
        query = query.filter(
            (Policy.title.ilike(f"%{search}%")) |
            (Policy.content.ilike(f"%{search}%")) |
            (Policy.summary.ilike(f"%{search}%"))
        )

    total = query.count()
    policies = query.order_by(Policy.publish_date.desc()).offset((page - 1) * size).limit(size).all()

    return PolicyList(
        total=total,
        items=policies,
        page=page,
        size=size
    )

@router.post("/policies", response_model=PolicyResponse)
async def create_policy(
    policy: PolicyCreate,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin)
):
    new_policy = Policy(
        id=str(uuid.uuid4()),
        **policy.model_dump(),
        publish_date=datetime.utcnow()
    )
    db.add(new_policy)
    db.commit()
    db.refresh(new_policy)
    return new_policy

@router.get("/policies/{policy_id}", response_model=PolicyResponse)
async def get_policy(
    policy_id: str,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin)
):
    policy = db.query(Policy).filter(Policy.id == policy_id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    return policy

@router.patch("/policies/{policy_id}", response_model=PolicyResponse)
async def update_policy(
    policy_id: str,
    policy_update: PolicyUpdate,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin)
):
    db_policy = db.query(Policy).filter(Policy.id == policy_id).first()
    if not db_policy:
        raise HTTPException(status_code=404, detail="Policy not found")

    update_data = policy_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_policy, field, value)

    db_policy.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_policy)
    return db_policy

@router.delete("/policies/{policy_id}", status_code=204)
async def delete_policy(
    policy_id: str,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin)
):
    db_policy = db.query(Policy).filter(Policy.id == policy_id).first()
    if not db_policy:
        raise HTTPException(status_code=404, detail="Policy not found")

    db.delete(db_policy)
    db.commit()
    return None

# Industry News endpoints
@router.get("/industry-news", response_model=IndustryNewsList)
async def list_industry_news(
    page: int = Query(1, gt=0),
    size: int = Query(10, gt=0, le=100),
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin)
):
    query = db.query(IndustryNews)

    if category:
        query = query.filter(IndustryNews.category == category)
    if search:
        query = query.filter(
            (IndustryNews.title.ilike(f"%{search}%")) |
            (IndustryNews.content.ilike(f"%{search}%")) |
            (IndustryNews.summary.ilike(f"%{search}%"))
        )

    total = query.count()
    news = query.order_by(IndustryNews.publish_date.desc()).offset((page - 1) * size).limit(size).all()


    return IndustryNewsList(
        total=total,
        items=news,
        page=page,
        size=size
    )

@router.post("/industry-news", response_model=IndustryNewsResponse)
async def create_industry_news(
    news: IndustryNewsCreate,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin)
):
    new_news = IndustryNews(
        id=str(uuid.uuid4()),
        **news.model_dump(),
        publish_date=datetime.utcnow()
    )
    db.add(new_news)
    db.commit()
    db.refresh(new_news)
    return new_news

@router.get("/industry-news/{news_id}", response_model=IndustryNewsResponse)
async def get_industry_news(
    news_id: str,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin)
):
    news = db.query(IndustryNews).filter(IndustryNews.id == news_id).first()
    if not news:
        raise HTTPException(status_code=404, detail="Industry news not found")
    return news

@router.patch("/industry-news/{news_id}", response_model=IndustryNewsResponse)
async def update_industry_news(
    news_id: str,
    news_update: IndustryNewsUpdate,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin)
):
    db_news = db.query(IndustryNews).filter(IndustryNews.id == news_id).first()
    if not db_news:
        raise HTTPException(status_code=404, detail="Industry news not found")

    update_data = news_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_news, field, value)

    db_news.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_news)
    return db_news

@router.delete("/industry-news/{news_id}", status_code=204)
async def delete_industry_news(
    news_id: str,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin)
):
    db_news = db.query(IndustryNews).filter(IndustryNews.id == news_id).first()
    if not db_news:
        raise HTTPException(status_code=404, detail="Industry news not found")

    db.delete(db_news)
    db.commit()
    return None
