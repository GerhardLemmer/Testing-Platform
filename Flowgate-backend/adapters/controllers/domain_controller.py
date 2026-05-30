from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from application.services.domain_service import create_domain_for_user
from infrastructure.dependencies import get_db, get_current_user, require_role
from infrastructure.repositories.domain_repository import get_domains_for_user, get_org_domains_for_user
from adapters.schemas import DomainCreateSchema
from infrastructure.models import User

router = APIRouter()


@router.post("/domains")
def create_new_domain(payload: DomainCreateSchema, db: Session = Depends(get_db), current_user: User = Depends(require_role(["admin", "developer"]))):
    domain = create_domain_for_user(db, payload.name, current_user.id, payload.organization_id)
    return {"message": f"Domain '{domain.name}' created successfully.", "id": domain.id}


@router.get("/domains")
def list_domains(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    personal = get_domains_for_user(db, current_user.id)
    org = get_org_domains_for_user(db, current_user.id)
    return [{"id": d.id, "name": d.name, "type": "personal" if d.user_id else "organization"} for d in personal + org]
