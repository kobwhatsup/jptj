from uuid import uuid4
from datetime import datetime
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.user import User
from app.models.forum.post import ForumPost, ForumCategory, PostStatus
from app.models.forum.comment import ForumComment, CommentStatus

def create_test_users(db: Session):
    test_users = [
        {
            "id": "test-user-1",
            "username": "testuser1",
            "email": "test1@example.com",
            "hashed_password": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyNiAYMyzJ/eRm",  # "password123"
            "is_active": True,
            "created_at": datetime.utcnow(),
            "role": "user"
        },
        {
            "id": "test-user-2",
            "username": "testuser2",
            "email": "test2@example.com",
            "hashed_password": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyNiAYMyzJ/eRm",  # "password123"
            "is_active": True,
            "created_at": datetime.utcnow(),
            "role": "user"
        }
    ]

    for user_data in test_users:
        user = User(**user_data)
        db.add(user)

    try:
        db.commit()
        print("Test users created successfully")
        return test_users
    except Exception as e:
        db.rollback()
        print(f"Error creating test users: {str(e)}")
        return None

def main():
    db = SessionLocal()
    try:
        users = create_test_users(db)
        if users:
            print("Test data setup completed successfully")
    finally:
        db.close()

if __name__ == "__main__":
    main()
