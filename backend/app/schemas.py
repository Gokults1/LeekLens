from pydantic import BaseModel, EmailStr
from typing import List

class ScanRequest(BaseModel):
    email: EmailStr

class RiskProfile(BaseModel):
    level: str
    score: int

class BreachDetail(BaseModel):
    name: str
    title: str
    domain: str
    breach_date: str
    added_date: str
    affected_accounts: int
    data_classes: List[str]
    description: str
    verified: bool
    is_stealer_log: bool = False
    is_malware: bool = False

class ScanResponse(BaseModel):
    email: str
    found: bool
    risk: RiskProfile
    breach_count: int
    breaches: List[BreachDetail]
    exposed_data_summary: List[str]
    recommendations: List[str]
