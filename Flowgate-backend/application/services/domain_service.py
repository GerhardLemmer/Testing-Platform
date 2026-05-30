from fastapi import HTTPException
from sqlalchemy.orm import Session
from infrastructure.repositories.domain_repository import create_domain
from infrastructure.repositories.organization_repository import get_organization_member


def create_domain_for_user(db: Session, name: str, user_id: str, organization_id: str = None):
    if organization_id:
        member = get_organization_member(db, organization_id, user_id)
        if not member:
            raise HTTPException(status_code=403, detail="You are not a member of this organization")
        if member.role not in ["admin", "developer"]:
            raise HTTPException(status_code=403, detail="Only admins and developers can create domains")
        return create_domain(db, name, organization_id=organization_id)
    return create_domain(db, name, user_id=user_id)
