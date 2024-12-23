import sys
import os

# Add the project root to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

import requests
import json
import logging
from datetime import datetime
from app.config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_URL = f"http://localhost:8000{settings.API_V1_STR}"
admin_token = None

def test_admin_login():
    global admin_token
    logger.info("Testing admin login...")

    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            data={"username": "admin", "password": "password123"}
        )

        logger.info(f"Login response status: {response.status_code}")
        logger.info(f"Login response: {response.text}")

        assert response.status_code == 200, f"Login failed with status {response.status_code}: {response.text}"
        data = response.json()
        admin_token = data["access_token"]
        logger.info("✅ Admin login successful")
        return admin_token
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise

def test_user_management(token):
    logger.info("Testing user management...")
    headers = {"Authorization": f"Bearer {token}"}

    try:
        # Get users list
        response = requests.get(f"{BASE_URL}/admin/users", headers=headers)
        assert response.status_code == 200, f"Failed to get users with status {response.status_code}"
        logger.info("✅ User list retrieved successfully")
        return True
    except Exception as e:
        logger.error(f"User management error: {str(e)}")
        return False

def test_content_management(token):
    logger.info("Testing content management...")
    headers = {"Authorization": f"Bearer {token}"}

    try:
        # Get content list
        response = requests.get(f"{BASE_URL}/admin/content", headers=headers)
        assert response.status_code == 200, f"Failed to get content with status {response.status_code}"
        logger.info("✅ Content list retrieved successfully")
        return True
    except Exception as e:
        logger.error(f"Content management error: {str(e)}")
        return False

def test_forum_management(token):
    logger.info("Testing forum management...")
    headers = {"Authorization": f"Bearer {token}"}

    try:
        # Get forum posts
        response = requests.get(f"{BASE_URL}/admin/forum/posts", headers=headers)
        assert response.status_code == 200, f"Failed to get forum posts with status {response.status_code}"
        logger.info("✅ Forum management successful")
        return True
    except Exception as e:
        logger.error(f"Forum management error: {str(e)}")
        return False

if __name__ == '__main__':
    try:
        # Test admin login
        token = test_admin_login()
        if not token:
            logger.error("❌ Admin login failed")
            sys.exit(1)

        # Test user management
        if not test_user_management(token):
            logger.error("❌ User management failed")
            sys.exit(1)

        # Test content management
        if not test_content_management(token):
            logger.error("❌ Content management failed")
            sys.exit(1)

        # Test forum management
        if not test_forum_management(token):
            logger.error("❌ Forum management failed")
            sys.exit(1)

        logger.info("✅ All tests passed successfully!")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Test suite failed: {str(e)}")
        sys.exit(1)
