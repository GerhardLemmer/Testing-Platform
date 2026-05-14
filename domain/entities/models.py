from sqlalchemy import Column, String, Boolean, Integer, ForeignKey
from infrastructure.database import Base

class ScenarioModel(Base):
    __tablename__ = "scenarios"

    id = Column(String, primary_key=True)
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