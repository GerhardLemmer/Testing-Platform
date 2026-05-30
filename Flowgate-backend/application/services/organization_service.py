from fastapi import HTTPException
from sqlalchemy.orm import Session
from infrastructure.repositories.organization_repository import (
    create_organization,
    get_organization_by_name,
    get_organization_by_id,
    add_organization_member,
    get_organization_member,
)
from infrastructure.repositories.user_repository import get_user_by_email


def create_org_with_owner(db: Session, name: str, owner_id: str):
    if get_organization_by_name(db, name):
        raise HTTPException(status_code=400, detail="Organization name already taken")
    org = create_organization(db, name, owner_id)
    add_organization_member(db, org.id, owner_id, "admin")
    return org


def add_member_to_org(db: Session, org_id: str, requestor_id: str, email: str, role: str):
    org = get_organization_by_id(db, org_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    requestor = get_organization_member(db, org_id, requestor_id)
    if not requestor or requestor.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can add members")
    user = get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if get_organization_member(db, org_id, user.id):
        raise HTTPException(status_code=400, detail="User is already a member")
    add_organization_member(db, org_id, user.id, role)
    return user
