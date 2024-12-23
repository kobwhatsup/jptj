from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import uuid4
from datetime import datetime
from app.database import get_db
from app.api.auth import get_current_admin
from app.models.forum.post import ForumPost, PostStatus, ForumCategory
from app.models.forum.comment import ForumComment, CommentStatus
from app.schemas.forum.post import ForumPostList, ForumPostResponse, ForumPostUpdate, ForumPostCreate
from app.schemas.forum.comment import ForumCommentList, ForumCommentResponse, ForumCommentUpdate, ForumCommentCreate

router = APIRouter(prefix="/forum", tags=["forum"])

@router.post("/posts", response_model=ForumPostResponse)
async def create_post(
    post: ForumPostCreate,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    try:
        print(f"Creating post with data: {post}")
        print(f"Current admin: {current_admin}")

        db_post = ForumPost(
            id=str(uuid4()),
            title=post.title,
            content=post.content,
            summary=post.summary,
            category=post.category,
            status=PostStatus.PENDING,
            author_id=post.author_id,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        print(f"Created ForumPost object: {db_post.__dict__}")

        db.add(db_post)
        db.commit()
        db.refresh(db_post)
        return db_post
    except Exception as e:
        print(f"Error creating post: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/posts", response_model=ForumPostList)
async def list_posts(
    status: Optional[str] = None,
    category: Optional[str] = None,
    page: int = Query(1, gt=0),
    size: int = Query(10, gt=0),
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin)
):
    query = db.query(ForumPost)
    if status:
        query = query.filter(ForumPost.status == status)
    if category:
        query = query.filter(ForumPost.category == category)

    total = query.count()
    items = query.offset((page - 1) * size).limit(size).all()
    return {"total": total, "items": items, "page": page, "size": size}

@router.put("/posts/approve", response_model=ForumPostResponse)
async def approve_post(
    post_id: str,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin)
):
    post = db.query(ForumPost).filter(ForumPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    post.status = PostStatus.APPROVED
    post.publish_date = datetime.utcnow()
    db.commit()
    db.refresh(post)
    return post

@router.put("/posts/remove", response_model=ForumPostResponse)
async def remove_post(
    post_id: str,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin)
):
    post = db.query(ForumPost).filter(ForumPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    post.status = PostStatus.REMOVED
    db.commit()
    db.refresh(post)
    return post

@router.post("/comments", response_model=ForumCommentResponse)
async def create_comment(
    comment: ForumCommentCreate,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    try:
        print(f"Creating comment with data: {comment}")

        post = db.query(ForumPost).filter(ForumPost.id == comment.post_id).first()
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")

        if comment.parent_id:
            parent_comment = db.query(ForumComment).filter(ForumComment.id == comment.parent_id).first()
            if not parent_comment:
                raise HTTPException(status_code=404, detail="Parent comment not found")

        db_comment = ForumComment(
            id=str(uuid4()),
            content=comment.content,
            post_id=comment.post_id,
            parent_id=comment.parent_id,
            status=CommentStatus.PENDING,
            author_id=comment.author_id,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )

        db.add(db_comment)
        db.commit()
        db.refresh(db_comment)
        return db_comment
    except Exception as e:
        print(f"Error creating comment: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/comments", response_model=ForumCommentList)
async def list_comments(
    status: Optional[CommentStatus] = None,
    post_id: Optional[str] = None,
    page: int = Query(1, gt=0),
    size: int = Query(10, gt=0),
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin)
):
    query = db.query(ForumComment)
    if status:
        query = query.filter(ForumComment.status == status)
    if post_id:
        query = query.filter(ForumComment.post_id == post_id)

    total = query.count()
    items = query.offset((page - 1) * size).limit(size).all()
    return {"total": total, "items": items, "page": page, "size": size}

@router.put("/comments/approve", response_model=ForumCommentResponse)
async def approve_comment(
    comment_id: str,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin)
):
    comment = db.query(ForumComment).filter(ForumComment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    comment.status = CommentStatus.APPROVED
    comment.publish_date = datetime.utcnow()
    db.commit()
    db.refresh(comment)
    return comment

@router.put("/comments/remove", response_model=ForumCommentResponse)
async def remove_comment(
    comment_id: str,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin)
):
    comment = db.query(ForumComment).filter(ForumComment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    comment.status = CommentStatus.REMOVED
    db.commit()
    db.refresh(comment)
    return comment

@router.get("/categories")
async def list_categories(
    _: dict = Depends(get_current_admin)
):
    return [
        {"name": "经验交流", "key": ForumCategory.EXPERIENCE},
        {"name": "案例分享", "key": ForumCategory.CASE},
        {"name": "技能提升", "key": ForumCategory.SKILL},
        {"name": "政策讨论", "key": ForumCategory.POLICY},
        {"name": "调解心得", "key": ForumCategory.INSIGHT}
    ]
