from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from infrastructure.dependencies import get_db, get_current_user
from infrastructure.scenario_repository import (
    create_organization,
    get_organization_by_name,
    get_organization_by_id,
    add_organization_member,
    get_organization_member,
    get_user_by_email
)
from adapters.schemas import OrganizationCreateSchema, AddMemberSchema
from domain.entities.models import User

router = APIRouter()

@router.post("/organizations")
def create_org(payload: OrganizationCreateSchema, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    existing = get_organization_by_name(db, payload.name)
    if existing:
        raise HTTPException(status_code = 400, detail = "Organization name already taken")
    org = create_organization(db, payload.name, current_user.id)
    add_organization_member(db, org.id, current_user.id, "admin")
    return {"message": f"Organization '{org.name}' created successfully.", "id": org.id}

@router.post("/organizations/{org_id}/members")
def add_member(org_id: str, payload: AddMemberSchema, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    org = get_organization_by_id(db, org_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    current_member = get_organization_member(db, org_id, current_user.id)
    if not current_member or current_member.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can add members")
    user = get_user_by_email(db, payload.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    existing = get_organization_member(db, org_id, user.id)
    if existing:
        raise HTTPException(status_code=400, detail="User is already a member")
    add_organization_member(db, org_id, user.id, payload.role)
    return {"message": f"User '{user.full_name}' added as {payload.role}."}