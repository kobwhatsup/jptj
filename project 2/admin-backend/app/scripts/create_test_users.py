from app.database import SessionLocal
from app.models.user import User
from datetime import datetime
import uuid
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_test_users():
    db = SessionLocal()
    try:
        test_users = [
            {
                'username': 'test_mediator',
                'email': 'mediator@test.com',
                'role': 'mediator',
                'full_name': 'Test Mediator'
            },
            {
                'username': 'test_expert',
                'email': 'expert@test.com',
                'role': 'expert',
                'full_name': 'Test Expert'
            },
            {
                'username': 'test_user',
                'email': 'user@test.com',
                'role': 'user',
                'full_name': 'Test User'
            }
        ]

        for user_data in test_users:
            if not db.query(User).filter(User.username == user_data['username']).first():
                user = User(
                    id=str(uuid.uuid4()),
                    username=user_data['username'],
                    email=user_data['email'],
                    role=user_data['role'],
                    full_name=user_data['full_name'],
                    hashed_password='$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyNiAYlGz0RYni',  # test123
                    created_at=datetime.utcnow()
                )
                db.add(user)
                logger.info(f"Created test user: {user_data['username']}")
            else:
                logger.info(f"Test user {user_data['username']} already exists")

        db.commit()
        logger.info("All test users created successfully")
    except Exception as e:
        logger.error(f"Error creating test users: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == '__main__':
    create_test_users()
