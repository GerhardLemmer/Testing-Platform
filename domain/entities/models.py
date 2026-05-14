from sqlalchemy import Column, String, Boolean, Integer, ForeignKey, Enum
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
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=True)
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
    success = Column(Boolean, nullable=False)
    message = Column(String, nullable=False)
    order = Column(Integer, nullable=False)
