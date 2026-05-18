from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from application.use_cases.run_scenario import run_scenario_in_domain
from infrastructure.dependencies import get_db, get_current_user, require_role
from infrastructure.scenario_repository import create_scenario, create_step, create_step_rule, get_scenarios_for_user, get_domain_by_id, get_organization_member, create_scenario_input, get_scenario_inputs
from adapters.schemas import ScenarioCreateSchema
from domain.entities.models import User

router = APIRouter()

@router.get("/scenarios")
def list_scenarios(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    scenarios = get_scenarios_for_user(db, current_user.id)
    return [
        {
            "id": s.id,
            "scenario_type": s.scenario_type,
            "scenario_name": s.scenario_name,
            "display_name": s.display_name
        }
        for s in scenarios
    ]
@router.get("/scenarios/run/{scenario_type}")
def handle_scenario(scenario_type: str, scenario_name: str, domain_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    domain = get_domain_by_id(db, domain_id)
    if not domain:
        raise HTTPException(status_code=404, detail="Domain not found")
    if domain.user_id != current_user.id:
        if not domain.organization_id:
            raise HTTPException(status_code=403, detail="Access denied to this domain")
        member = get_organization_member(db, domain.organization_id, current_user.id)
        if not member:
            raise HTTPException(status_code=403, detail="Access denied to this domain")
    result = run_scenario_in_domain(db, domain_id, scenario_type, scenario_name, user_id=current_user.id)
    if result is None:
        raise HTTPException(status_code=404, detail="Scenario not found")
    return result

@router.post("/scenarios")
def create_new_scenario(payload: ScenarioCreateSchema, db: Session = Depends(get_db), current_user: User = Depends(require_role(["admin", "developer"]))):
    scenario = create_scenario(db, payload.domain_id, payload.scenario_type, payload.scenario_name, payload.display_name)
    for step in payload.steps:
        db_step = create_step(db, scenario.id, step.name, step.order, step.default_outcome)
        for rule in step.rules:
            create_step_rule(db, db_step.id, rule.field, rule.operator, rule.value, rule.outcome, rule.message, rule.order)
    for input in payload.inputs:
        create_scenario_input(db, scenario.id, input.field, input.type, input.label, input.required, input.order)
    return {"success": True, "message": f"Scenario '{payload.display_name}' created successfully."}

@router.get("/scenarios/{scenario_id}/inputs")
def get_inputs(scenario_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    inputs = get_scenario_inputs(db, scenario_id)
    return [
        {"field": i.field, "type": i.type, "label": i.label, "required": i.required, "order": i.order}
        for i in inputs
    ]
