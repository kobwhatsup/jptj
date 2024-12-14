"""create forum tables

Revision ID: create_forum_tables
Revises:
Create Date: 2024-12-13 18:48:18.141131

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'create_forum_tables'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    connection = op.get_bind()

    # Check if tables exist
    inspector = sa.inspect(connection)
    tables = inspector.get_table_names()

    if 'forum_posts' not in tables and 'forum_comments' not in tables:
        # Create forum_posts table with text-based category and status
        op.create_table(
            'forum_posts',
            sa.Column('id', sa.String(), nullable=False),
            sa.Column('title', sa.String(), nullable=False),
            sa.Column('content', sa.Text(), nullable=False),
            sa.Column('summary', sa.String(), nullable=True),
            sa.Column('category', sa.String(), nullable=False),  # Using string instead of enum
            sa.Column('status', sa.String(), nullable=False),    # Using string instead of enum
            sa.Column('author_id', sa.String(), nullable=False),
            sa.Column('publish_date', sa.DateTime(), nullable=True),
            sa.Column('views', sa.Integer(), nullable=False, server_default='0'),
            sa.Column('likes', sa.Integer(), nullable=False, server_default='0'),
            sa.Column('created_at', sa.DateTime(), nullable=False),
            sa.Column('updated_at', sa.DateTime(), nullable=False),
            sa.ForeignKeyConstraint(['author_id'], ['users.id'], ),
            sa.PrimaryKeyConstraint('id'),
            sa.CheckConstraint("category IN ('EXPERIENCE', 'CASE', 'SKILL', 'POLICY', 'INSIGHT')"),
            sa.CheckConstraint("status IN ('PENDING', 'APPROVED', 'REMOVED')")
        )

        # Create forum_comments table with text-based status
        op.create_table(
            'forum_comments',
            sa.Column('id', sa.String(), nullable=False),
            sa.Column('content', sa.Text(), nullable=False),
            sa.Column('status', sa.String(), nullable=False),    # Using string instead of enum
            sa.Column('post_id', sa.String(), nullable=False),
            sa.Column('parent_id', sa.String(), nullable=True),
            sa.Column('author_id', sa.String(), nullable=False),
            sa.Column('publish_date', sa.DateTime(), nullable=True),
            sa.Column('likes', sa.Integer(), nullable=False, server_default='0'),
            sa.Column('created_at', sa.DateTime(), nullable=False),
            sa.Column('updated_at', sa.DateTime(), nullable=False),
            sa.ForeignKeyConstraint(['author_id'], ['users.id'], ),
            sa.ForeignKeyConstraint(['parent_id'], ['forum_comments.id'], ),
            sa.ForeignKeyConstraint(['post_id'], ['forum_posts.id'], ),
            sa.PrimaryKeyConstraint('id'),
            sa.CheckConstraint("status IN ('PENDING', 'APPROVED', 'REMOVED')")
        )

def downgrade():
    op.drop_table('forum_comments')
    op.drop_table('forum_posts')
