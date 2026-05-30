import os
import uuid
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from infrastructure.database import SessionLocal
from infrastructure.models import User
from keycloak import KeycloakOpenID
from dotenv import load_dotenv
from typing import List
from infrastructure.repositories.domain_repository import get_domain_by_id
from infrastructure.repositories.organization_repository import get_organization_member

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
        KEYCLOAK_PUBLIC_KEY = "-----BEGIN PUBLIC KEY-----\n" + keycloak_openid.public_key() + "\n-----END PUBLIC KEY-----"
        options = {"verify_signature": True, "verify_aud": False, "verify_exp": True}
        token_info = keycloak_openid.decode_token(token, key=KEYCLOAK_PUBLIC_KEY, options=options)
    except Exception:
        raise HTTPException(status_code=401, detail="Could not validate token")

    keycloak_id = token_info.get("sub")
    email = token_info.get("email", "")
    full_name = token_info.get("name", "")
    roles = token_info.get("realm_access", {}).get("roles", [])

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

    user.roles = roles
    return user

def require_role(allowed_roles: List[str]):
    def role_checker(current_user: User = Depends(get_current_user)):
        if not any(role in allowed_roles for role in getattr(current_user, "roles", [])):
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return current_user
    return role_checker

def check_domain_access(domain_id: str, current_user: User, db: Session):
    domain = get_domain_by_id(db, domain_id)
    if not domain: 
        raise HTTPException(status_code=404, detail="Domain not found")
    if domain.user_id != current_user.id:
        if not domain.organization_id:
            raise HTTPException(status_code=403, detail="Access denied to this domain")
        member = get_organization_member(db, domain.organization_id, current_user.id)
        if not member:
            raise HTTPException(status_code=403, detail="Access denied to this domain")
