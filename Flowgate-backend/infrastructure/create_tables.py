from infrastructure.database import engine, Base
from infrastructure.models import User, Organization, OrganizationMember, Domain, ScenarioModel, StepModel, StepRule, ScenarioRun, ScenarioInput


Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

print("Tables recreated successfully")