from fastapi import FastAPI
from adapters.controllers.payment_controller import router as payment_router
from adapters.controllers.auth_controller import router as auth_router
from adapters.controllers.order_controller import router as order_router
from adapters.controllers.file_upload_controller import router as file_upload_router

app = FastAPI()

app.include_router(payment_router)
app.include_router(auth_router)
app.include_router(order_router)
app.include_router(file_upload_router)

