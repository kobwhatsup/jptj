from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import sys
import os

# Add the app directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.models import Admin
from app.api.auth import get_password_hash
from app.config import settings

def create_initial_admin(username: str, password: str):
    engine = create_engine(settings.DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    try:
        print("Starting admin user creation process...")

        # Force delete existing admin if exists
        existing_admin = db.query(Admin).filter(Admin.username == username).first()
        if existing_admin:
            print(f"Deleting existing admin user '{username}'")
            db.delete(existing_admin)
            db.commit()
            print("Existing admin user deleted")

        print(f"Creating new admin user: {username}")

        # Create new admin
        hashed_password = get_password_hash(password)
        print(f"Password hashed successfully: {hashed_password}")

        admin = Admin(
            username=username,
            hashed_password=hashed_password,
            is_active=True
        )

        print("Adding admin user to database...")
        db.add(admin)
        db.commit()
        print("Database commit successful")

        # Verify admin was created
        created_admin = db.query(Admin).filter(Admin.username == username).first()
        if created_admin:
            print(f"Successfully created admin user: {username}")
            print(f"Stored hash: {created_admin.hashed_password}")
        else:
            raise Exception("Admin user was not created successfully")

    except Exception as e:
        print(f"Error creating admin user: {e}")
        db.rollback()
        raise  # Re-raise the exception for proper error handling
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python create_admin.py <username> <password>")
        sys.exit(1)

    username = sys.argv[1]
    password = sys.argv[2]
    create_initial_admin(username, password)
