from fastapi import APIRouter
from application.use_cases.run_scenario import run_order_scenario

router = APIRouter()

@router.get("/order")
def run_scenario(scenario_name: str):
    result = run_order_scenario(scenario_name)
    return result