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

class UserRegisterSchema(BaseModel):
    email: str
    password: str
    full_name: str

class UserLoginSchema(BaseModel):
    email: str
    password: str

class TokenSchema(BaseModel):
    access_token: str
    token_type: str
