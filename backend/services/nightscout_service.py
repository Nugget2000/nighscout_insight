import requests
from typing import Optional, List
from pydantic import ValidationError

from models.entry import Entry


def get_nightscout_entries(nightscout_url: str, api_token: str, count: int = 100) -> Optional[List[Entry]]:
    """
    Fetches and validates entries from the Nightscout API.

    Args:
        nightscout_url: The URL of the Nightscout instance.
        api_token: The API token for authentication.
        count: The number of entries to fetch.

    Returns:
        A list of validated Entry objects, or None if an error occurred.
    """
    try:
        params = {"count": count}
        request_url = f"{nightscout_url}/api/v1/entries.json?token={api_token}"
        response = requests.get(request_url, params=params)
        response.raise_for_status()  # Raise an exception for bad status codes

        entries_data = response.json()
        # Validate and parse the data using the Pydantic model
        validated_entries = [Entry.model_validate(entry_data) for entry_data in entries_data]
        return validated_entries

    except requests.exceptions.RequestException as e:
        # Handle connection errors or bad responses
        print(f"Error fetching data from Nightscout: {e}")
        return None
    except ValidationError as e:
        # Handle data validation errors
        print(f"Error validating Nightscout data: {e}")
        return None
