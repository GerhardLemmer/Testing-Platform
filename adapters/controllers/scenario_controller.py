from fastapi import APIRouter, HTTPException
from application.use_cases.run_scenario import run_scenario

router = APIRouter()

@router.get("/scenarios/{scenario_type}")
def handle_scenario(scenario_type: str, scenario_name: str):
    result = run_scenario(scenario_type=scenario_type, scenario_name=scenario_name)
    if result is None:
        raise HTTPException(status_code=404, detail="Scenario not found")
    return result