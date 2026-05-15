import os
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from infrastructure.database import SessionLocal
from domain.entities.models import User
from keycloak import KeycloakOpenID
from dotenv import load_dotenv
import uuid

load_dotenv()

security = HTTPBearer()

keycloak_openid = KeycloakOpenID(
    server_url=os.getenv("KEYCLOAK_URL"),
    realm_name=os.getenv("KEYCLOAK_REALM"),
    client_id=os.getenv("KEYCLOAK_CLIENT_ID"),
    client_secret_key=os.getenv("KEYCLOAK_CLIENT_SECRET")
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)) -> User:
    token = credentials.credentials
    try:
        token_info = keycloak_openid.introspect(token)
        if not token_info.get("active"):
            raise HTTPException(status_code=401, detail="Invalid or expired token")
    except Exception:
        raise HTTPException(status_code=401, detail="Could not validate token")
    
    keycloak_id = token_info.get("sub")
    email = token_info.get("email", "")
    full_name = token_info.get("name", "")

    user = db.query(User).filter(User.keycloak_id == keycloak_id).first()
    if not user:
        user = User(
            id=str(uuid.uuid4()),
            keycloak_id=keycloak_id,
            email=email,
            full_name=full_name
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    return user
