from fastapi import HTTPException
from sqlalchemy.orm import Session
from infrastructure.repositories.organization_repository import (
    create_org_invite,
    create_organization,
    get_invites_for_user,
    get_organization_by_name,
    get_organization_by_id,
    add_organization_member,
    get_organization_member,
    update_invite_status,
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

def send_invite(db: Session, org_id: str, invited_email: str, invited_by:str):
    org = get_organization_by_id(db, org_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    return create_org_invite(db, org_id, invited_email, invited_by)

def get_user_invites(db: Session, user_email: str):
    rows = get_invites_for_user(db, user_email)
    return [
        {**invite.__dict__, "organization_name": org_name}
        for invite, org_name in rows
    ]

def respond_to_invite(db: Session, invite_id: str, status: str):
    if status not in ["accepted", "declined"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    invite = update_invite_status(db, invite_id, status)
    if status == "accepted":
        user = get_user_by_email(db, invite.invited_email)
        if user:
            add_organization_member(db, invite.organization_id, user.id, "admin")
    return invite


