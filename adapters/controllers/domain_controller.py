from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from infrastructure.dependencies import get_db, get_current_user
from infrastructure.scenario_repository import (
    create_domain,
    get_domains_for_user,
    get_domains_for_org,
    get_organization_member
)
from adapters.schemas import DomainCreateSchema
from domain.entities.models import User

router = APIRouter()

@router.post("/domains")
def create_new_domain(payload: DomainCreateSchema, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if payload.organization_id:
        member = get_organization_member(db, payload.organization_id, current_user.id)
        if not member:
            raise HTTPException(status_code = 403, detail = "You are not a member of this organization")
        if member.role not in ["admin", "developer"]:
            raise HTTPException(status_code = 403, detail = "Only admin and Developers can create domains")
        domain = create_domain(db, payload.name, organization_id = payload.organization_id)
    else:
        domain = create_domain(db, payload.name, user_id = current_user.id)
    return {"message": f"Domain '{domain.name}' created successfully.", "id": domain.id}

@router.get("/domains")
def list_domains(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    personal = get_domains_for_user(db, current_user.id)
    return [{"id": d.id, "name": d.name, "type": "personal" if d.user_id else "organization"} for d in personal]