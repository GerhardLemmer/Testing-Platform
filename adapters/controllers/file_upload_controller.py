from fastapi import APIRouter
from application.use_cases.run_scenario import run_file_upload_scenario

router = APIRouter()

@router.get("/file-upload")
def run_scenario(scenario_name: str):
    result = run_file_upload_scenario(scenario_name)
    return result