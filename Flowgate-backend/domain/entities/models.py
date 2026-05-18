from sqlalchemy import Column, String, Boolean, Integer, ForeignKey, Enum, DateTime, Text
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.orm import relationship
import enum
from infrastructure.database import Base

class RoleEnum(str, enum.Enum):
    admin = "admin"
    developer = "developer"
    qa = "qa"
    viewer = "viewer"

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    keycloak_id = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    full_name = Column(String, nullable=False)

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    owner_id = Column(String, ForeignKey("users.id"), nullable=False)

class OrganizationMember(Base):
    __tablename__ = "organization_members"

    id = Column(String, primary_key=True)
    organization_id = Column(String, ForeignKey("organizations.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    role = Column(Enum(RoleEnum), nullable=False)

class Domain(Base):
    __tablename__ = "domains"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    organization_id = Column(String, ForeignKey("organizations.id"), nullable=True)

class ScenarioModel(Base):
    __tablename__ = "scenarios"

    id = Column(String, primary_key=True)
    domain_id = Column(String, ForeignKey("domains.id"), nullable=False)
    scenario_type = Column(String, nullable=False)
    scenario_name = Column(String, nullable=False)
    display_name = Column(String, nullable=False)

class StepModel(Base):
    __tablename__ = "steps"

    id = Column(String, primary_key=True)
    scenario_id = Column(String, ForeignKey("scenarios.id"), nullable=False)
    name = Column(String, nullable=False)
    order = Column(Integer, nullable=False)
    default_outcome = Column(String, nullable=False, default="pass")
    rules = relationship("StepRule", backref="step", cascade="all, delete-orphan")

class StepRule(Base):
    __tablename__ = "step_rules"

    id = Column(String, primary_key=True)
    step_id = Column(String, ForeignKey("steps.id"), nullable=False)
    field = Column(String, nullable=False)
    operator = Column(String, nullable=False)
    value = Column(String, nullable=False)
    outcome = Column(String, nullable=False)
    message = Column(String, nullable=False)
    order = Column(Integer, nullable=False, default=0)

class ScenarioRun(Base):
    __tablename__ = "scenario_runs"

    id = Column(String, primary_key=True)
    scenario_id = Column(String, ForeignKey("scenarios.id"), nullable=False)
    triggered_by = Column(String, ForeignKey("users.id"), nullable=False)
    input_data = Column(JSON, nullable=True)
    outcome = Column(String, nullable=False)
    failed_step = Column(String, nullable=True)
    created_at = Column(DateTime, nullable=False)

class ScenarioInput(Base):
    __tablename__ = "scenario_inputs"

    id = Column(String, primary_key=True)
    scenario_id = Column(String, ForeignKey("scenarios.id"), nullable=False)
    field = Column(String, nullable=False)
    type = Column(String, nullable=False)
    label = Column(String, nullable=False)
    required = Column(Boolean, nullable=False, default=True)
    order = Column(Integer, nullable=False, default=0)