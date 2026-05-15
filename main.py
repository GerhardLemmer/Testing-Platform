from fastapi import FastAPI
from adapters.controllers.scenario_controller import router as scenario_router
from adapters.controllers.organization_controller import router as org_router
from adapters.controllers.domain_controller import router as domain_router

app = FastAPI()

app.include_router(scenario_router)
app.include_router(org_router)
app.include_router(domain_router)
