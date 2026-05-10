"""
Lucida Risk Simulator — FastAPI backend.
Loads the RF model at startup, exposes /api/health and /api/simulate.
"""

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app import inference
from app.schemas import (
    SimulateRequest,
    SimulateResponse,
    SimulateRawRequest,
    HealthResponse,
    ExplainResponse,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    inference.load_model()
    yield


app = FastAPI(
    title="Lucida Risk Simulator API",
    version="0.1.0",
    description=(
        "Educational simulator for the Lucida preventive dynamic underwriting "
        "concept. Built on synthetic data calibrated to four published "
        "clinical studies. Not a medical or insurance product."
    ),
    lifespan=lifespan,
)

# Production: set CORS_ORIGINS to the public domain (comma-separated).
# Same-origin via host nginx makes CORS unnecessary in production, but we
# keep the middleware permissively configurable for local dev where the
# frontend runs on :3000 and the backend on :8000.
_cors_env = os.getenv("CORS_ORIGINS", "http://localhost:3000")
_cors_origins = [o.strip() for o in _cors_env.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.get("/api/health", response_model=HealthResponse)
def health():
    return HealthResponse(
        status="ok",
        model_loaded=inference.is_loaded(),
        model_auc=inference.model_auc(),
    )


@app.post("/api/simulate", response_model=SimulateResponse)
def simulate(req: SimulateRequest):
    if not inference.is_loaded():
        raise HTTPException(503, "Model not loaded")
    result = inference.simulate(req.model_dump())
    return SimulateResponse(**result)


@app.post("/api/simulate_raw", response_model=SimulateResponse)
def simulate_raw(req: SimulateRawRequest):
    """Live Typing Lab — direct-feature simulator, no slider abstraction."""
    if not inference.is_loaded():
        raise HTTPException(503, "Model not loaded")
    result = inference.simulate_raw(req.model_dump())
    return SimulateResponse(**result)


@app.post("/api/explain", response_model=ExplainResponse)
def explain(req: SimulateRawRequest):
    """Feature-ablation explainability + standardised cohort distances.

    Accepts the same body as /simulate_raw.
    """
    if not inference.is_loaded():
        raise HTTPException(503, "Model not loaded")
    result = inference.explain(req.model_dump())
    return ExplainResponse(**result)
