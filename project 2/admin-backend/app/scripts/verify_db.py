import sys
import os

# Add the project root to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.database import Base, engine
from app.models.user import User
from app.models.admin import Admin
from sqlalchemy import inspect
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def verify_database():
    try:
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        logger.info(f'Tables in database: {tables}')

        if 'users' not in tables or 'admins' not in tables:
            logger.info('Creating missing tables...')
            Base.metadata.create_all(bind=engine)
            logger.info('Tables created successfully')
        else:
            logger.info('All required tables exist')

        return True
    except Exception as e:
        logger.error(f'Error verifying database: {str(e)}')
        return False

if __name__ == '__main__':
    verify_database()
