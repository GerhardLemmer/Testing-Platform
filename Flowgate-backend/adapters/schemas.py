from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Any, Dict
from datetime import datetime

class StepRuleSchema(BaseModel):
    field: str
    operator: str
    value: str
    outcome: str
    message: str
    order: int = 0

class StepSchema(BaseModel):
    name: str
    order: int
    default_outcome: str = "pass"
    rules: List[StepRuleSchema] = []

class ScenarioRunSchema(BaseModel):
    domain_id: str
    input_data: Optional[Dict[str, Any]] = None
    scenario_name: str
    scenario_type: str

class OrganizationCreateSchema(BaseModel):
    name: str

class AddMemberSchema(BaseModel):
    email: str
    role: str

class DomainCreateSchema(BaseModel):
    name: str
    organization_id: Optional[str] = None

class ScenarioInputSchema(BaseModel):
    field: str
    type: str
    label: str
    required: bool = True
    order: int = 0

class ScenarioCreateSchema(BaseModel):
    domain_id: str
    scenario_type: str
    scenario_name: str
    display_name: str
    steps: List[StepSchema]
    inputs: List[ScenarioInputSchema] = []

class OrgInviteCreateSchema(BaseModel):
    organization_id: str
    invited_email: str

class OrgInviteResponseSchema(BaseModel):
    id: str
    organization_id: str
    organization_name: str
    invited_email: str
    invited_by: str
    status: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class RespondToInviteSchema(BaseModel):
    status: str
