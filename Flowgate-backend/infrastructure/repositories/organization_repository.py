import uuid
from sqlalchemy.orm import Session
from infrastructure.models import Organization, OrganizationMember, OrgInvite
from datetime import datetime


def create_organization(db: Session, name: str, owner_id: str):
    org = Organization(
        id=str(uuid.uuid4()),
        name=name,
        owner_id=owner_id
    )
    db.add(org)
    db.commit()
    db.refresh(org)
    return org

def get_organization_by_name(db: Session, name: str):
    return db.query(Organization).filter(Organization.name == name).first()

def get_organization_by_id(db: Session, org_id: str):
    return db.query(Organization).filter(Organization.id == org_id).first()

def get_organizations_for_user(db: Session, user_id: str):
    return (
        db.query(Organization)
        .join(OrganizationMember, OrganizationMember.organization_id == Organization.id)
        .filter(OrganizationMember.user_id == user_id)
        .all()
    )

def add_organization_member(db: Session, org_id: str, user_id: str, role: str):
    member = OrganizationMember(
        id=str(uuid.uuid4()),
        organization_id=org_id,
        user_id=user_id,
        role=role
    )
    db.add(member)
    db.commit()
    db.refresh(member)
    return member

def get_organization_member(db: Session, org_id: str, user_id: str):
    return (
        db.query(OrganizationMember)
        .filter(
            OrganizationMember.organization_id == org_id,
            OrganizationMember.user_id == user_id
        )
        .first()
    )

def create_org_invite(db: Session, org_id: str, invited_email: str, invited_by: str):
    invite = OrgInvite(
        id=str(uuid.uuid4()),
        organization_id=org_id,
        invited_email=invited_email,
        invited_by=invited_by,
        status="pending",
        created_at=datetime.utcnow()
    )
    db.add(invite)
    db.commit()
    db.refresh(invite)
    return invite

def get_invites_for_user(db: Session, email: str):
    return (
        db.query(OrgInvite, Organization.name)
        .join(Organization, Organization.id == OrgInvite.organization_id)
        .filter(OrgInvite.invited_email == email)
        .all()
    )

def update_invite_status(db: Session, invite_id: str, new_status: str):
    invite = db.query(OrgInvite).filter(OrgInvite.id == invite_id).first()
    if invite:
        invite.status = new_status
        db.commit()
        db.refresh(invite)
    return invite