import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import ScanRequest, ScanResponse, RiskProfile, BreachDetail
from app.services.xon import fetch_breaches_for_email
from app.services.risk import calculate_risk, generate_recommendations

app = FastAPI(title="LeakLens API")

# Configure CORS for the frontend
origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
frontend_url = os.environ.get("FRONTEND_URL")
if frontend_url:
    origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def root_health_check():
    return {"status": "ok"}

@app.get("/api/health")
async def api_health_check():
    return {"status": "ok"}

@app.post("/api/scan", response_model=ScanResponse)
async def scan_email(request: ScanRequest):
    email = request.email
    
    # Fetch breaches from XON
    raw_breaches = await fetch_breaches_for_email(email)
    
    if not raw_breaches:
        return ScanResponse(
            email=email,
            found=False,
            risk=RiskProfile(level="LOW", score=0),
            breach_count=0,
            breaches=[],
            exposed_data_summary=[],
            recommendations=[]
        )
        
    # Process breaches
    breach_details = []
    all_data_classes = set()
    
    for b in raw_breaches:
        # Extract data classes
        b_data_classes = b.get("exposedData", [])
        all_data_classes.update(b_data_classes)
        
        breach_type = b.get("breachType", "")
        
        detail = BreachDetail(
            name=b.get("breachID", "Unknown"),
            title=b.get("breachID", "Unknown"),
            domain=b.get("domain", ""),
            breach_date=b.get("breachedDate", ""),
            added_date=b.get("addedDate", ""),
            affected_accounts=b.get("exposedRecords", 0),
            data_classes=b_data_classes,
            description=b.get("exposureDescription", ""),
            verified=b.get("verified", False),
            is_stealer_log=(breach_type == "StealerLogs"),
            is_malware=(breach_type == "ComboList" or breach_type == "StealerLogs")
        )
        breach_details.append(detail)
        
    # Calculate Risk
    score, level = calculate_risk(breach_details)
    
    # Generate Recommendations
    recommendations = generate_recommendations(all_data_classes)
    
    # Return normalized JSON
    return ScanResponse(
        email=email,
        found=True,
        risk=RiskProfile(level=level, score=score),
        breach_count=len(breach_details),
        breaches=breach_details,
        exposed_data_summary=list(all_data_classes),
        recommendations=recommendations
    )
