"""merge forum tables

Revision ID: merge_forum_tables
Revises: create_forum_tables, f9d84f69f98a
Create Date: 2024-12-13 19:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'merge_forum_tables'
down_revision = ('create_forum_tables', 'f9d84f69f98a')
branch_labels = None
depends_on = None

def upgrade():
    pass

def downgrade():
    pass
