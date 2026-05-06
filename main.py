from fastapi import FastAPI
from adapters.controllers.payment_controller import router

app = FastAPI()

app.include_router(router)
