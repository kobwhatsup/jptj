import sys
import json
import requests
from app.config import settings

def get_admin_token():
    try:
        response = requests.post(
            f"http://localhost:8000{settings.API_V1_STR}/auth/login",
            data={
                "username": "admin",
                "password": "password123"
            }
        )
        if response.status_code == 200:
            return response.json().get('access_token', '')
        else:
            print(f"Error getting token: {response.status_code}", file=sys.stderr)
            return ''
    except Exception as e:
        print(f"Error getting token: {e}", file=sys.stderr)
        return ''

if __name__ == "__main__":
    print(get_admin_token())
