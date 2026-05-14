from infrastructure.database import engine, Base
from domain.entities.models import ScenarioModel

Base.metadata.create_all(bind=engine)

print("Tables created successfully")