import requests
from typing import Optional, List
from pydantic import ValidationError
from datetime import datetime, time

from models.entry import Entry
from models.treatment import Treatment


def get_nightscout_entries(nightscout_url: str, api_token: str, from_date: str, to_date: str, count: int = 0) -> Optional[List[Entry]]:
    """
    Fetches and validates entries from the Nightscout API for a specific date range.

    Args:
        nightscout_url: The URL of the Nightscout instance.
        api_token: The API token for authentication.
        from_date: The start date in ISO format (YYYY-MM-DD).
        to_date: The end date in ISO format (YYYY-MM-DD).
        count: The number of entries to fetch (0 for all in range).

    Returns:
        A list of validated Entry objects, or None if an error occurred.
    """
    try:
        params = {
            "count": count,
            "find[dateString][$gte]": from_date,
            "find[dateString][$lte]": to_date
        }
        request_url = f"{nightscout_url}/api/v1/entries.json?token={api_token}"
        response = requests.get(request_url, params=params)
        response.raise_for_status()  # Raise an exception for bad status codes

        entries_data = response.json()
        validated_entries = [Entry.model_validate(entry_data) for entry_data in entries_data]
        return validated_entries

    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from Nightscout: {e}")
        return None
    except ValidationError as e:
        print(f"Error validating Nightscout data: {e}")
        return None

def get_nightscout_treatments(nightscout_url: str, api_token: str, from_date: str, to_date: str, count: int = 0) -> Optional[List[Treatment]]:
    """
    Fetches and validates treatments from the Nightscout API for a specific date range.

    Args:
        nightscout_url: The URL of the Nightscout instance.
        api_token: The API token for authentication.
        from_date: The start date in ISO format (YYYY-MM-DD).
        to_date: The end date in ISO format (YYYY-MM-DD).
        count: The number of treatments to fetch (0 for all in range).

    Returns:
        A list of validated Treatment objects, or None if an error occurred.
    """
    try:
        params = {
            "count": count,
            "find[created_at][$gte]": from_date,
            "find[created_at][$lte]": to_date
        }
        request_url = f"{nightscout_url}/api/v1/treatments.json?token={api_token}"
        response = requests.get(request_url, params=params)
        response.raise_for_status()  # Raise an exception for bad status codes

        treatments_data = response.json()
        validated_treatments = [Treatment.model_validate(treatment_data) for treatment_data in treatments_data]
        return validated_treatments

    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from Nightscout: {e}")
        return None
    except ValidationError as e:
        print(f"Error validating Nightscout data: {e}")
        return None
