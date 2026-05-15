from pydantic import BaseModel
from typing import List

class StepSchema(BaseModel):
    name: str
    success: bool
    message: str
    order: int

class ScenarioCreateSchema(BaseModel):
    domain_id: str
    scenario_type: str
    scenario_name: str
    display_name: str
    steps: List[StepSchema]


class OrganizationCreateSchema(BaseModel):
    name: str

class AddMemberSchema(BaseModel):
    email: str
    role: str

class DomainCreateSchema(BaseModel):
    name: str
    organization_id: str = None