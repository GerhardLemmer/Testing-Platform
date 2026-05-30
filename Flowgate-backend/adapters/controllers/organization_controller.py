from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from application.services.organization_service import create_org_with_owner, add_member_to_org
from infrastructure.dependencies import get_db, get_current_user
from infrastructure.repositories.organization_repository import get_organizations_for_user
from adapters.schemas import OrganizationCreateSchema, AddMemberSchema
from infrastructure.models import User

router = APIRouter()


@router.get("/organizations")
def list_organizations(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    orgs = get_organizations_for_user(db, current_user.id)
    return [{"id": o.id, "name": o.name} for o in orgs]


@router.post("/organizations")
def create_org(payload: OrganizationCreateSchema, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    org = create_org_with_owner(db, payload.name, current_user.id)
    return {"message": f"Organization '{org.name}' created successfully.", "id": org.id}


@router.post("/organizations/{org_id}/members")
def add_member(org_id: str, payload: AddMemberSchema, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user = add_member_to_org(db, org_id, current_user.id, payload.email, payload.role)
    return {"message": f"User '{user.full_name}' added as {payload.role}."}
