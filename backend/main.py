from fastapi import FastAPI
from api import app as api_app

app = FastAPI(title="MT5 Strategy Analyzer")
app.mount("/", api_app)