from fastapi.testclient import TestClient
from app.main import app
from app.services.risk import calculate_risk
from app.schemas import BreachDetail

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_scan_email_success():
    # XON doesn't require an API key, so this should succeed and return 200
    response = client.post("/api/scan", json={"email": "test@example.com"})
    assert response.status_code == 200
    data = response.json()
    assert "found" in data

def test_risk_calculation():
    # 1. No breaches
    score, level = calculate_risk([])
    assert score == 0
    assert level == 'LOW'

    # 2. Medium risk class
    b1 = BreachDetail(
        name='Test', title='Test', domain='', breach_date='', added_date='', affected_accounts=0,
        data_classes=['Phone numbers'], description='', verified=True
    )
    score, level = calculate_risk([b1])
    assert level == 'MEDIUM'

    # 3. High risk class + Passwords
    b2 = BreachDetail(
        name='Test', title='Test', domain='', breach_date='', added_date='', affected_accounts=0,
        data_classes=['Passwords'], description='', verified=True
    )
    score, level = calculate_risk([b2])
    # 1 breach (10) + HIGH risk (25) + Password penalty (20) = 55 -> HIGH
    assert level == 'HIGH'
    
    # 4. Malware involvement
    b3 = BreachDetail(
        name='Test', title='Test', domain='', breach_date='', added_date='', affected_accounts=0,
        data_classes=['Email addresses'], description='', verified=True,
        is_malware=True
    )
    score, level = calculate_risk([b3])
    # 1 breach (10) + Low risk (5) + Malware penalty (40) = 55 -> HIGH
    assert level == 'HIGH'