import httpx
import logging
import urllib.parse
from fastapi import HTTPException

logger = logging.getLogger(__name__)

XON_EMAIL_URL = "https://api.xposedornot.com/v1/check-email"
XON_BREACHES_URL = "https://api.xposedornot.com/v1/breaches"

_client: httpx.AsyncClient | None = None
_breaches_cache: dict = {}

def get_client() -> httpx.AsyncClient:
    global _client
    if _client is None:
        headers = {
            "user-agent": "LeakLens/1.0",
            "accept": "application/json"
        }
        _client = httpx.AsyncClient(headers=headers, timeout=30.0)
    return _client

async def get_all_breaches() -> dict:
    global _breaches_cache
    if not _breaches_cache:
        client = get_client()
        response = await client.get(XON_BREACHES_URL)
        if response.status_code == 200:
            data = response.json()
            for b in data.get("exposedBreaches", []):
                _breaches_cache[b["breachID"]] = b
    return _breaches_cache

async def fetch_breaches_for_email(email: str) -> list:
    """
    Fetches breach information for an email from XposedOrNot.
    Handles HTTP errors gracefully and maps them to appropriate fastAPI HTTPExceptions.
    Returns an empty list for 404 (no breaches found).
    """
    encoded_email = urllib.parse.quote(email)
    url = f"{XON_EMAIL_URL}/{encoded_email}"
    
    client = get_client()

    try:
        response = await client.get(url)
    except httpx.RequestError as e:
        logger.error(f"Error communicating with XON API: {e}")
        raise HTTPException(status_code=502, detail="Failed to communicate with breach database.")

    if response.status_code == 200:
        data = response.json()
        # XON returns {"breaches": [["Breach1", "Breach2"]]}
        breach_lists = data.get("breaches", [[]])
        if not breach_lists or not breach_lists[0]:
            return []
            
        breach_names = breach_lists[0]
        all_breaches = await get_all_breaches()
        
        result = []
        for name in breach_names:
            if name in all_breaches:
                result.append(all_breaches[name])
            else:
                # Fallback if details not found in the global list
                result.append({
                    "breachID": name,
                    "domain": "",
                    "breachedDate": "",
                    "addedDate": "",
                    "exposedRecords": 0,
                    "exposedData": [],
                    "exposureDescription": "Description unavailable.",
                    "verified": True,
                    "breachType": "Unknown"
                })
        return result
    elif response.status_code == 404:
        # 404 means no breaches found for this account (this is a 'good' result)
        return []
    elif response.status_code == 400:
        raise HTTPException(status_code=400, detail="Invalid email format provided to breach database.")
    elif response.status_code == 429:
        logger.warning("XON API rate limit exceeded.")
        raise HTTPException(status_code=429, detail="Too many requests. Please try again later.")
    elif response.status_code >= 500:
        logger.error(f"XON API returned server error: {response.status_code}")
        raise HTTPException(status_code=502, detail="Breach database is currently unavailable.")
    else:
        logger.error(f"Unexpected status code from XON: {response.status_code}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred.")
