import numpy as np
from typing import List, Dict

from models.entry import Entry

# TIR ranges (in mmol/L)
TIR_LOWER = 3.9
TIR_UPPER = 10.0

def calculate_kpis(entries: List[Entry]) -> Dict[str, float]:
    """
    Calculates glycemic KPIs from a list of Nightscout entries.

    Args:
        entries: A list of Entry objects with sgv values.

    Returns:
        A dictionary containing the calculated KPIs.
    """
    if not entries:
        return {}

    mmol_values = [entry.mmol for entry in entries if entry.mmol is not None]
    if not mmol_values:
        return {}

    # Convert to numpy array for easier calculations
    mmol_array = np.array(mmol_values)

    # Mean
    mean_glucose = np.mean(mmol_array)

    # Standard Deviation
    std_dev = np.std(mmol_array)

    # Coefficient of Variation
    cv = (std_dev / mean_glucose) * 100 if mean_glucose > 0 else 0

    # Time in Range (TIR)
    total_readings = len(mmol_array)
    tir = (np.sum((mmol_array >= TIR_LOWER) & (mmol_array <= TIR_UPPER)) / total_readings) * 100
    tar = (np.sum(mmol_array > TIR_UPPER) / total_readings) * 100  # Time Above Range
    tbr = (np.sum(mmol_array < TIR_LOWER) / total_readings) * 100  # Time Below Range

    # Add time in tight range (3.9 - 7.8 mmol/L) TITR
    tight_lower = 3.9
    tight_upper = 7.8
    titr = (np.sum((mmol_array >= tight_lower) & (mmol_array <= tight_upper)) / total_readings) * 100 

    # Estimated A1c (eA1c)
    # Using the formula: (mean_glucose_mg_dl + 46.7) / 28.7
    #ea1c = (mean_glucose + 46.7) / 28.7
    ea1c_percent = (mean_glucose + 2.59) / 1.59
    ea1c = (ea1c_percent - 2.15) * 10.929

    # add bool that indicates if the day is within the accepted range for total_readings above 280 to ensure reliability
    total_readings_accepted = total_readings >= 275

    # bool that indicates tir percent is within the accepted range of 70%
    tir_accepted = tir >= 70.0

    # bool that indicates if titr percent is within the accepted range of 50%
    titr_accepted = titr >= 50.0

    return {
        "mean_glucose": round(mean_glucose, 2),
        "std_dev": round(std_dev, 2),
        "cv": round(cv, 2),
        "tir_percent": round(tir, 2),
        "tir_accepted": tir_accepted,
        "tar_percent": round(tar, 2),
        "tbr_percent": round(tbr, 2),
        "titr_percent": round(titr, 2),
        "titr_accepted": titr_accepted,
        "ea1c": round(ea1c, 2),
        "total_readings": total_readings,
        "total_readings_accepted": total_readings_accepted
    }
