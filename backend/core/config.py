import os
from dotenv import load_dotenv

load_dotenv() # Laddar variabler från .env-filen

class Settings:
    # Nightscout
    NS_URL: str = os.getenv("NS_URL")
    NS_API_SECRET: str = os.getenv("NS_API_SECRET")

    # API-säkerhet
    API_KEY_SECRET: str = os.getenv("API_KEY_SECRET")

    # GCP
    GCP_PROJECT_ID: str = os.getenv("GCP_PROJECT_ID")

    # Gemini
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY")

    # E-post
    MAIL_SENDER: str = os.getenv("MAIL_SENDER")
    MAIL_RECIPIENTS: list[str] = os.getenv("MAIL_RECIPIENTS", "").split(",")

settings = Settings()
