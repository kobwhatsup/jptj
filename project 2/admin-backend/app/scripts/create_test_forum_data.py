from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.forum.post import ForumPost, ForumCategory, PostStatus
from app.models.forum.comment import ForumComment, CommentStatus
from app.models.user import User
import uuid
from datetime import datetime

def create_test_forum_data():
    db = SessionLocal()
    try:
        # Get test users
        users = db.query(User).all()
        if not users:
            print("No users found. Please run create_test_users.py first.")
            return

        # Create test posts for each category
        test_posts = [
            {
                "title": "调解经验分享：如何处理邻里纠纷",
                "content": "基于多年调解经验，分享处理邻里纠纷的有效方法...",
                "summary": "邻里纠纷调解经验总结",
                "category": ForumCategory.EXPERIENCE,
                "author_id": users[0].id
            },
            {
                "title": "商业纠纷调解案例分析",
                "content": "本文分析一起典型的商业合同纠纷调解案例...",
                "summary": "商业纠纷调解案例详解",
                "category": ForumCategory.CASE,
                "author_id": users[1].id
            },
            {
                "title": "提升调解技巧：有效沟通方法",
                "content": "探讨调解过程中的沟通技巧和注意事项...",
                "summary": "调解沟通技巧提升指南",
                "category": ForumCategory.SKILL,
                "author_id": users[0].id
            },
            {
                "title": "新版《调解法》解读与讨论",
                "content": "对新修订的调解法规进行解读和探讨...",
                "summary": "调解法规政策讨论",
                "category": ForumCategory.POLICY,
                "author_id": users[1].id
            },
            {
                "title": "调解工作心得：换位思考的重要性",
                "content": "分享在调解工作中关于换位思考的心得体会...",
                "summary": "调解工作心得分享",
                "category": ForumCategory.INSIGHT,
                "author_id": users[0].id
            }
        ]

        created_posts = []
        for post_data in test_posts:
            post = ForumPost(
                id=str(uuid.uuid4()),
                **post_data,
                status=PostStatus.PENDING
            )
            db.add(post)
            created_posts.append(post)

        db.commit()

        # Create test comments for each post
        for post in created_posts:
            # Parent comments
            parent_comment = ForumComment(
                id=str(uuid.uuid4()),
                content=f"这是对《{post.title}》的评论",
                post_id=post.id,
                author_id=users[1].id if post.author_id == users[0].id else users[0].id,
                status=CommentStatus.PENDING
            )
            db.add(parent_comment)
            db.commit()

            # Reply comments
            reply_comment = ForumComment(
                id=str(uuid.uuid4()),
                content="感谢分享，这个观点很有启发",
                post_id=post.id,
                parent_id=parent_comment.id,
                author_id=users[0].id if parent_comment.author_id == users[1].id else users[1].id,
                status=CommentStatus.PENDING
            )
            db.add(reply_comment)

        db.commit()
        print("Test forum data created successfully!")

    except Exception as e:
        print(f"Error creating test forum data: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_forum_data()
