from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from app.models.admin import Admin
from app.database import get_db
from app.config import settings
from pydantic import BaseModel
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Security configuration
SECRET_KEY = settings.SECRET_KEY  # Use settings configuration
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")  # Include full API path

router = APIRouter()

class Token(BaseModel):
    access_token: str
    token_type: str

class AdminCreate(BaseModel):
    username: str
    password: str

def verify_password(plain_password: str, hashed_password: str):
    logger.debug(f"Verifying password: plain='{plain_password}', hashed='{hashed_password}'")
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str):
    logger.debug(f"Generating hash for password with bcrypt settings: {pwd_context.to_dict()}")
    hashed = pwd_context.hash(password)
    logger.debug(f"Generated hash: {hashed}")
    return hashed

def authenticate_admin(db: Session, username: str, password: str):
    try:
        admin = db.query(Admin).filter(Admin.username == username).first()
        logger.debug(f"Found admin: {admin}")
        if not admin:
            return False
        if not verify_password(password, admin.hashed_password):
            return False
        return admin
    except Exception as e:
        logger.error(f"Error in authenticate_admin: {str(e)}")
        return False

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    try:
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=15)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    except Exception as e:
        logger.error(f"Error in create_access_token: {str(e)}")
        raise

async def get_current_admin(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        admin_id: str = payload.get("id")
        if username is None or admin_id is None:
            raise credentials_exception
        return {"username": username, "id": admin_id}
    except JWTError as e:
        logger.error(f"JWT Error: {str(e)}")
        raise credentials_exception

@router.post("/auth/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    try:
        logger.debug(f"Login attempt for username: {form_data.username}")
        logger.debug(f"Request form data: {form_data}")
        admin = authenticate_admin(db, form_data.username, form_data.password)
        if not admin:
            logger.warning(f"Failed login attempt for username: {form_data.username}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": admin.username, "id": admin.id},
            expires_delta=access_token_expires
        )
        logger.debug("Successfully generated access token")
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        logger.error(f"Error in login_for_access_token: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/admin/logout")
async def logout(current_admin: Admin = Depends(get_current_admin)):
    return {"message": "Successfully logged out"}

@router.get("/admin/me")
async def read_admin_me(current_admin: Admin = Depends(get_current_admin)):
    return current_admin
