from pydantic import BaseModel
from typing import List

class StepSchema(BaseModel):
    name: str
    success: bool
    message: str
    order: int

class ScenarioCreateSchema(BaseModel):
    scenario_type: str
    scenario_name: str
    display_name: str
    steps: List[StepSchema]