from fastapi import APIRouter
from application.use_cases.run_scenario import run_payment_scenario

router = APIRouter()

@router.get("/payment")
def run_scenario(scenario_name: str):
    result = run_payment_scenario(scenario_name)
    return result