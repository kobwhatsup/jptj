from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://user_nivokbjpqx:peg3D61CNP4okxyqqz0L@devinapps-backend-prod.cluster-clussqewa0rh.us-west-2.rds.amazonaws.com/db_ukxxgtqxse?sslmode=require"
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Admin Backend"
    SECRET_KEY: str = "your-secret-key-stored-in-environment-12345"

settings = Settings()
