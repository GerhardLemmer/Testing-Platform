from fastapi import FastAPI
from adapters.controllers.scenario_controller import router as scenario_router

app = FastAPI()

app.include_router(scenario_router)

