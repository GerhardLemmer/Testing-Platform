from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from application.use_cases.run_scenario import run_scenario_in_domain
from infrastructure.dependencies import get_db, get_current_user, require_role
from infrastructure.repositories.scenario_repository import (
    create_scenario,
    create_step,
    create_step_rule,
    get_scenarios_for_domain,
    create_scenario_input,
    get_scenario_inputs,
    get_scenario_runs,
    get_scenario_by_id,
    get_steps,
    delete_scenario_steps,
    update_scenario_details,
    delete_scenario
)
from infrastructure.repositories.domain_repository import get_domain_by_id
from infrastructure.repositories.organization_repository import get_organization_member
from adapters.schemas import ScenarioCreateSchema, ScenarioRunSchema
from domain.entities.models import User

router = APIRouter()

@router.get("/scenarios")
def list_scenarios(domain_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    domain = get_domain_by_id(db, domain_id)
    if not domain:
        raise HTTPException(status_code=404, detail="Domain not found")
    if domain.user_id != current_user.id:
        if not domain.organization_id:
            raise HTTPException(status_code=403, detail="Access denied to this domain")
        member = get_organization_member(db, domain.organization_id, current_user.id)
        if not member:
            raise HTTPException(status_code=403, detail="Access denied to this domain")
    scenarios = get_scenarios_for_domain(db, domain_id)
    return [
        {
            "id": s.id,
            "scenario_type": s.scenario_type,
            "scenario_name": s.scenario_name,
            "display_name": s.display_name
        }
        for s in scenarios
    ]

@router.post("/scenarios")
def create_new_scenario(payload: ScenarioCreateSchema, db: Session = Depends(get_db), current_user: User = Depends(require_role(["admin", "developer"]))):
    scenario = create_scenario(db, payload.domain_id, payload.scenario_type, payload.scenario_name, payload.display_name)
    for step in payload.steps:
        db_step = create_step(db, scenario.id, step.name, step.order, step.default_outcome)
        for rule in step.rules:
            create_step_rule(db, db_step.id, rule.field, rule.operator, rule.value, rule.outcome, rule.message, rule.order)
    for input_field in payload.inputs:
        create_scenario_input(db, scenario.id, input_field.field, input_field.type, input_field.label, input_field.required, input_field.order)
    return {"success": True, "message": f"Scenario '{payload.display_name}' created successfully."}

@router.get("/scenarios/{scenario_id}/inputs")
def get_inputs(scenario_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    inputs = get_scenario_inputs(db, scenario_id)
    return [
        {"field": i.field, "type": i.type, "label": i.label, "required": i.required, "order": i.order}
        for i in inputs
    ]

@router.post("/scenarios/run")
def run_scenarios(payload: ScenarioRunSchema, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    domain = get_domain_by_id(db, payload.domain_id)
    if not domain:
        raise HTTPException(status_code=404, detail="Domain not found")
    if domain.user_id != current_user.id:
        if not domain.organization_id:
            raise HTTPException(status_code=403, detail="Access denied to this domain")
        member = get_organization_member(db, domain.organization_id, current_user.id)
        if not member:
            raise HTTPException(status_code=403, detail="Access denied to this domain")
    scenarios = run_scenario_in_domain(db, payload.domain_id, payload.scenario_type, payload.scenario_name, payload.input_data, current_user.id)
    if scenarios is None:
        raise HTTPException(status_code=401, detail="Invalid scenario details")
    if isinstance(scenarios, dict) and scenarios.get("error") == "missing_inputs":
        raise HTTPException(status_code=422, detail={"message": "Missing required inputs", "missing": scenarios["missing"]})
    return scenarios

@router.get("/scenarios/{scenario_id}/runs")
def list_scenario_runs(scenario_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    runs = get_scenario_runs(db, scenario_id)
    return[
        {
            "id": r.id,
            "outcome": r.outcome,
            "failed_step": r.failed_step,
            "input_data": r.input_data,
            "created_at": r.created_at
        }
        for r in runs
    ]

@router.get("/scenarios/{scenario_id}")
def get_scenario_with_id(scenario_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    scenario = get_scenario_by_id(db, scenario_id)
    if not scenario:
        raise HTTPException(status_code=404, detail="Scenario not found")
    steps = get_steps(db, scenario_id)
    inputs = get_scenario_inputs(db, scenario_id)
    return{
        "id": scenario.id,
        "scenario_type": scenario.scenario_type,
        "scenario_name": scenario.scenario_name,
        "display_name": scenario.display_name,
        "steps": [
            {
                "id": s.id,
                "name": s.name,
                "order": s.order,
                "default_outcome": s.default_outcome,
                "rules": [
                    {"id": r.id, "field": r.field, "operator": r.operator, "value": r.value, "outcome": r.outcome, "message": r.message, "order": r.order}
                    for r in sorted(s.rules, key=lambda x: x.order)
                ]
            }
            for s in sorted(steps, key=lambda x: x.order)
        ],
        "inputs": [
            {"field": i.field, "type": i.type, "label": i.label, "required": i.required, "order": i.order}
            for i in inputs
        ]
    }

@router.put("/scenarios/{scenario_id}")
def update_scenario_by_id(scenario_id: str, payload: ScenarioCreateSchema, db: Session = Depends(get_db), current_user: User = Depends(require_role(["admin", "developer"]))):
    scenario = get_scenario_by_id(db, scenario_id)
    if not scenario:
        raise HTTPException(status_code=404, detail="Scenario was not found")
    update_scenario_details(db, scenario.id, payload.scenario_type, payload.scenario_name, payload.display_name)
    delete_scenario_steps(db, scenario.id)
    for step in payload.steps:
        db_step = create_step(db, scenario.id, step.name, step.order, step.default_outcome)
        for rule in step.rules:
            create_step_rule(db, db_step.id, rule.field, rule.operator, rule.value, rule.outcome, rule.message, rule.order)
    for input_field in payload.inputs:
        create_scenario_input(db, scenario.id, input_field.field, input_field.type, input_field.label, input_field.required, input_field.order)
    return {"success": True, "message": f"Scenario '{payload.display_name}' updated successfully."}

@router.delete("/scenarios/{scenario_id}")
def delete_scenario_by_id(scenario_id: str, db: Session = Depends(get_db), current_user: User = Depends(require_role(["admin", "developer"]))):
    scenario = get_scenario_by_id(db, scenario_id)
    if not scenario:
        raise HTTPException(status_code=404, detail="Scenario not found")
    delete_scenario(db, scenario_id)
    return {"success": True, "message": f"Scenario '{scenario.display_name}' deleted successfully."}

