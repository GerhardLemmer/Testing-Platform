from fastapi import FastAPI
from adapters.controllers.scenario_controller import router as scenario_router
from adapters.controllers.auth_controller import router as auth_router

app = FastAPI()

app.include_router(auth_router)
app.include_router(scenario_router)
