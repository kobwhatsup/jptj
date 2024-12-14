import sys
import os

# Add the app directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.database import Base, engine

def drop_all_tables():
    try:
        Base.metadata.drop_all(engine)
        print("Successfully dropped all tables.")
    except Exception as e:
        print(f"Error dropping tables: {e}")
        sys.exit(1)

if __name__ == "__main__":
    drop_all_tables()
