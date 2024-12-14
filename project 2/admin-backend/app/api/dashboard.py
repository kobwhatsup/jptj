from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.user import User
from app.models.content import Policy, IndustryNews
from app.models.forum.post import ForumPost
from app.api.auth import get_current_admin

router = APIRouter()

@router.get("/metrics")
async def get_dashboard_metrics(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Get dashboard metrics for admin panel."""
    try:
        # Get user metrics
        total_users = db.query(func.count(User.id)).scalar()
        active_users = db.query(func.count(User.id)).filter(User.is_active == True).scalar()

        # Get content metrics
        total_policies = db.query(func.count(Policy.id)).scalar()
        total_news = db.query(func.count(IndustryNews.id)).scalar()

        # Get forum metrics
        total_posts = db.query(func.count(ForumPost.id)).scalar()
        pending_posts = db.query(func.count(ForumPost.id)).filter(
            ForumPost.status == 'pending'
        ).scalar()

        return {
            "totalUsers": total_users or 0,
            "activeUsers": active_users or 0,
            "totalPolicies": total_policies or 0,
            "totalNews": total_news or 0,
            "totalPosts": total_posts or 0,
            "pendingPosts": pending_posts or 0
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"获取仪表盘数据失败: {str(e)}"
        )
