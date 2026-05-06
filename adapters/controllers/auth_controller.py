from fastapi import APIRouter
from application.use_cases.run_scenario import run_auth_scenario

router = APIRouter()

@router.get("/auth")
def run_scenario(scenario_name: str):
    result = run_auth_scenario(scenario_name)
    return result