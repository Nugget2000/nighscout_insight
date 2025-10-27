import requests
from typing import Optional, List, Dict, Any

def get_nightscout_entries(nightscout_url: str, api_token: str, count: int = 100) -> Optional[List[Dict[str, Any]]]:
    """
    Fetches entries from the Nightscout API.

    Args:
        nightscout_url: The URL of the Nightscout instance.
        api_token: The API token for authentication.
        count: The number of entries to fetch.

    Returns:
        A list of entry dictionaries, or None if an error occurred.
    """
    try:
        # headers = {"api-secret": api_token}
        params = {"count": count}
        request_url = f"{nightscout_url}/api/v1/entries.json?token={api_token}"
        response = requests.get(request_url, params=params)
        response.raise_for_status()  # Raise an exception for bad status codes
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from Nightscout: {e}")
        return None