from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from application.use_cases.run_scenario import run_scenario
from infrastructure.dependencies import get_db, get_current_user
from infrastructure.scenario_repository import create_scenario, create_step, get_scenarios_for_user
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

@router.get("/scenarios/{scenario_type}")
def handle_scenario(scenario_type: str, scenario_name: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = run_scenario(db, scenario_type, scenario_name)
    if result is None:
        raise HTTPException(status_code=404, detail="Scenario not found")
    return result

@router.post("/scenarios")
def create_new_scenario(payload: ScenarioCreateSchema, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    scenario = create_scenario(db, payload.domain_id, payload.scenario_type, payload.scenario_name, payload.display_name)
    for step in payload.steps:
        create_step(db, scenario.id, step.name, step.success, step.message, step.order)
    return{"success": True, "message": f"Scenario '{payload.display_name}' created successfully."}

