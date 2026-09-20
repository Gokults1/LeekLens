from typing import List, Tuple
from app.schemas import BreachDetail

# Simple risk mapping heuristic
HIGH_RISK_CLASSES = {"Passwords", "Credit cards", "Bank account numbers", "Social security numbers", "Private messages", "Auth tokens", "Biometric data"}
MEDIUM_RISK_CLASSES = {"Phone numbers", "Physical addresses", "Dates of birth", "IP addresses", "Device information", "Location data", "Security questions and answers"}

def calculate_risk(breaches: List[BreachDetail]) -> Tuple[int, str]:
    if not breaches:
        return 0, "LOW"
    
    score = 0
    
    # Base risk from number of breaches
    score += len(breaches) * 15
    
    all_data_classes = set()
    is_malware_involved = False
    is_stealer_involved = False

    for b in breaches:
        if b.is_malware:
            is_malware_involved = True
        if b.is_stealer_log:
            is_stealer_involved = True
        for dc in b.data_classes:
            all_data_classes.add(dc)

    # Risk from data classes
    for dc in all_data_classes:
        if dc in HIGH_RISK_CLASSES:
            score += 25
        elif dc in MEDIUM_RISK_CLASSES:
            score += 10
        else:
            score += 5

    if is_malware_involved or is_stealer_involved:
        score += 40  # Massive penalty for malware/stealer logs

    if "Passwords" in all_data_classes:
        score += 20  # Additional penalty for passwords

    # Cap score at 100
    score = min(100, score)

    # Determine level
    if score >= 75:
        level = "CRITICAL"
    elif score >= 50:
        level = "HIGH"
    elif score >= 25:
        level = "MEDIUM"
    else:
        level = "LOW"
        
    return score, level

def generate_recommendations(data_classes: set) -> List[str]:
    recommendations = []
    
    if "Passwords" in data_classes:
        recommendations.append("Change your password immediately on the affected platforms.")
        recommendations.append("Never reuse the exposed password on other websites.")
        recommendations.append("Enable Two-Factor Authentication (2FA) wherever possible.")
    
    if "Phone numbers" in data_classes:
        recommendations.append("Be highly cautious of unsolicited text messages or calls (smishing/vishing).")
    
    if "Physical addresses" in data_classes:
        recommendations.append("Be vigilant about unexpected physical mail or local fraud attempts.")
    
    if "Credit cards" in data_classes or "Bank account numbers" in data_classes:
        recommendations.append("Monitor your bank and credit card statements closely for unauthorized transactions.")
        recommendations.append("Consider freezing your credit or placing a fraud alert on your credit file.")

    if not recommendations:
        if data_classes:
            recommendations.append("Stay alert for targeted phishing emails attempting to use this exposed data.")
        else:
            recommendations.append("No immediate action required, but general credential hygiene is recommended.")
            
    return recommendations
