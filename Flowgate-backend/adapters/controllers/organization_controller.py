from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from application.services.organization_service import create_org_with_owner, add_member_to_org, send_invite, get_user_invites, respond_to_invite
from infrastructure.dependencies import get_db, get_current_user
from infrastructure.repositories.organization_repository import get_organizations_for_user
from adapters.schemas import OrganizationCreateSchema, AddMemberSchema, OrgInviteCreateSchema, OrgInviteResponseSchema, RespondToInviteSchema
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


@router.post("/organizations/{org_id}/invites", response_model=OrgInviteResponseSchema)
def create_invite(org_id: str, payload: OrgInviteCreateSchema, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return send_invite(db, org_id, payload.invited_email, current_user.id)


@router.get("/invites", response_model=List[OrgInviteResponseSchema])
def list_invites(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_user_invites(db, current_user.email)


@router.put("/invites/{invite_id}", response_model=OrgInviteResponseSchema)
def update_invite(invite_id: str, payload: RespondToInviteSchema, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return respond_to_invite(db, invite_id, payload.status)
