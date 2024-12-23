from sqlalchemy import create_engine, inspect
from config import settings
from models import Admin, User, Content, ForumPost, ForumComment

def verify_database():
    try:
        # Create engine and connect
        engine = create_engine(settings.DATABASE_URL)
        inspector = inspect(engine)
        
        # Check if all tables exist
        tables = inspector.get_table_names()
        required_tables = ['admins', 'users', 'contents', 'forum_posts', 'forum_comments']
        
        print("Checking database tables...")
        for table in required_tables:
            if table in tables:
                print(f"✓ Table '{table}' exists")
            else:
                print(f"✗ Table '{table}' is missing")
        
        print("\nDatabase verification completed!")
        
    except Exception as e:
        print(f"Error during database verification: {e}")

if __name__ == "__main__":
    verify_database()
