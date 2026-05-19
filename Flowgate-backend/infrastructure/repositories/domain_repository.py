import uuid
from sqlalchemy.orm import Session
from domain.entities.models import Domain, OrganizationMember


def create_domain(db: Session, name: str, user_id: str = None, organization_id: str = None):
    domain = Domain(
        id=str(uuid.uuid4()),
        name=name,
        user_id=user_id,
        organization_id=organization_id
    )
    db.add(domain)
    db.commit()
    db.refresh(domain)
    return domain

def get_domain_by_id(db: Session, domain_id: str):
    return db.query(Domain).filter(Domain.id == domain_id).first()

def get_domains_for_user(db: Session, user_id: str):
    return db.query(Domain).filter(Domain.user_id == user_id).all()

def get_org_domains_for_user(db: Session, user_id: str):
    return (
        db.query(Domain)
        .join(OrganizationMember, OrganizationMember.organization_id == Domain.organization_id)
        .filter(OrganizationMember.user_id == user_id)
        .all()
    )
