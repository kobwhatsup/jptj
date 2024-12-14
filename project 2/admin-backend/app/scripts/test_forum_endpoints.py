import json
import sys
import time
import urllib.request
import urllib.parse
import urllib.error
from app.config import settings
from app.database import SessionLocal
from app.models.admin import Admin

def make_request(url, method="GET", headers=None, data=None, form_data=None):
    try:
        headers = headers or {}

        if form_data:
            form_data_encoded = []
            for key, value in form_data.items():
                encoded_key = urllib.parse.quote_plus(str(key))
                encoded_value = urllib.parse.quote_plus(str(value))
                form_data_encoded.append(f"{encoded_key}={encoded_value}")
            data = '&'.join(form_data_encoded).encode('utf-8')
            headers['Content-Type'] = 'application/x-www-form-urlencoded'
        elif data:
            data = json.dumps(data).encode('utf-8')
            headers['Content-Type'] = 'application/json'

        if method not in ["GET", "POST", "PUT"]:
            raise ValueError(f"Unsupported HTTP method: {method}")

        request = urllib.request.Request(
            url,
            data=data,
            headers=headers,
            method=method
        )

        with urllib.request.urlopen(request) as response:
            response_data = response.read().decode('utf-8')
            return {
                "status_code": response.status,
                "json": lambda: json.loads(response_data)
            }
    except urllib.error.HTTPError as http_error:
        error_msg = f"{http_error.code} - {http_error.reason}"
        if http_error.headers.get('Content-Type', '').startswith('application/json'):
            error_data = json.loads(http_error.read().decode('utf-8'))
            error_msg = f"{error_msg}: {error_data.get('detail', '')}"
        print(f"HTTP Error: {error_msg}", file=sys.stderr)
        return {
            "status_code": http_error.code,
            "json": lambda: {"error": error_msg}
        }
    except Exception as error:
        error_msg = str(error)
        print(f"Error: {error_msg}", file=sys.stderr)
        return {
            "status_code": 500,
            "json": lambda: {"error": error_msg}
        }

def get_admin_token(base_url):
    db = SessionLocal()
    try:
        admin = db.query(Admin).filter(Admin.username == "admin").first()
        if not admin:
            print("Admin user not found!", file=sys.stderr)
            return None

        response = make_request(
            f"{base_url}/api/v1/admin/login",
            method="POST",
            form_data={
                "username": "admin",
                "password": "admin123",
                "grant_type": "password",
                "scope": "",
                "client_id": "",
                "client_secret": ""
            }
        )

        if response["status_code"] != 200:
            print(f"Authentication failed: {response['status_code']}", file=sys.stderr)
            try:
                error_details = response["json"]()
                print(f"Error details: {error_details}", file=sys.stderr)
            except Exception as e:
                print(f"Could not parse error details: {e}", file=sys.stderr)
            return None

        try:
            result = response["json"]()
            return result.get("access_token")
        except Exception as e:
            print(f"Error parsing response: {e}", file=sys.stderr)
            return None
    finally:
        db.close()

def test_categories(base_url, token):
    print("\nTesting categories endpoint:")
    response = make_request(
        f"{base_url}/api/v1/admin/forum/categories",
        headers={"Authorization": f"Bearer {token}"}
    )
    print(json.dumps(response["json"](), indent=2, ensure_ascii=False))
    return response["status_code"] == 200

def test_post_creation(base_url, token):
    print("\nTesting post creation in each category:")
    categories = {
        "EXPERIENCE": "经验交流",
        "CASE": "案例分享",
        "SKILL": "技能提升",
        "POLICY": "政策讨论",
        "INSIGHT": "调解心得"
    }
    post_ids = []

    # Use test-user-1 as the author
    author_id = "test-user-1"  # This matches the ID in setup_test_data.py

    for category_key, category_name in categories.items():
        print(f"\nCreating post in category: {category_name}")
        response = make_request(
            f"{base_url}/api/v1/admin/forum/posts",
            method="POST",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            },
            data={
                "title": f"Test Post in {category_name}",
                "content": f"This is a test post in {category_name} category.",
                "summary": "Test summary",
                "category": category_key,
                "author_id": author_id
            }
        )
        print(json.dumps(response["json"](), indent=2, ensure_ascii=False))
        if response["status_code"] == 200:
            post_ids.append(response["json"]()["id"])
    return post_ids

def test_post_moderation(base_url, token, post_ids):
    print("\nTesting post moderation:")
    for post_id in post_ids:
        print(f"\nApproving post: {post_id}")
        response = make_request(
            f"{base_url}/api/v1/admin/forum/posts/approve?post_id={post_id}",
            method="PUT",
            headers={"Authorization": f"Bearer {token}"}
        )
        print(json.dumps(response["json"](), indent=2, ensure_ascii=False))

        if post_id == post_ids[-1]:
            print(f"\nRemoving post: {post_id}")
            response = make_request(
                f"{base_url}/api/v1/admin/forum/posts/remove?post_id={post_id}",
                method="PUT",
                headers={"Authorization": f"Bearer {token}"}
            )
            print(json.dumps(response["json"](), indent=2, ensure_ascii=False))

def test_comment_creation(base_url, token, post_ids):
    print("\nTesting comment creation and nesting:")
    comment_ids = []

    # Use test-user-1 as the author
    author_id = "test-user-1"  # This matches the ID in setup_test_data.py

    parent_response = make_request(
        f"{base_url}/api/v1/admin/forum/comments",
        method="POST",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        },
        data={
            "content": "This is a parent comment",
            "post_id": post_ids[0],
            "author_id": author_id
        }
    )
    print("\nCreated parent comment:")
    print(json.dumps(parent_response["json"](), indent=2, ensure_ascii=False))

    if parent_response["status_code"] == 200:
        parent_id = parent_response["json"]()["id"]
        comment_ids.append(parent_id)

        nested_response = make_request(
            f"{base_url}/api/v1/admin/forum/comments",
            method="POST",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            },
            data={
                "content": "This is a nested comment",
                "post_id": post_ids[0],
                "parent_id": parent_id,
                "author_id": author_id
            }
        )
        print("\nCreated nested comment:")
        print(json.dumps(nested_response["json"](), indent=2, ensure_ascii=False))

        if nested_response["status_code"] == 200:
            comment_ids.append(nested_response["json"]()["id"])

    return comment_ids

def test_comment_moderation(base_url, token, comment_ids):
    print("\nTesting comment moderation:")
    for comment_id in comment_ids:
        print(f"\nApproving comment: {comment_id}")
        response = make_request(
            f"{base_url}/api/v1/admin/forum/comments/approve?comment_id={comment_id}",
            method="PUT",
            headers={"Authorization": f"Bearer {token}"}
        )
        print(json.dumps(response["json"](), indent=2, ensure_ascii=False))

        if comment_id == comment_ids[-1]:
            print(f"\nRemoving comment: {comment_id}")
            response = make_request(
                f"{base_url}/api/v1/admin/forum/comments/remove?comment_id={comment_id}",
                method="PUT",
                headers={"Authorization": f"Bearer {token}"}
            )
            print(json.dumps(response["json"](), indent=2, ensure_ascii=False))

def main():
    base_url = "http://localhost:8000"
    print("Starting forum moderation tests...")

    token = get_admin_token(base_url)
    if not token:
        print("Failed to get authentication token. Make sure the admin user exists and the server is running.", file=sys.stderr)
        sys.exit(1)

    print("\nAuthentication successful!")

    if not test_categories(base_url, token):
        print("Category test failed!", file=sys.stderr)
        sys.exit(1)

    post_ids = test_post_creation(base_url, token)
    if post_ids:
        test_post_moderation(base_url, token, post_ids)
        comment_ids = test_comment_creation(base_url, token, post_ids)
        if comment_ids:
            test_comment_moderation(base_url, token, comment_ids)

    print("\nAll forum moderation tests completed successfully!")

if __name__ == "__main__":
    main()
