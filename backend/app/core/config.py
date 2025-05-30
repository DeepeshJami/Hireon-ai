from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    OPENAI_API_KEY: str = "your_api_key_here"  # Default is important for local dev without .env initially

    # Configure Pydantic-Settings to load from a .env file
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding='utf-8', extra='ignore')

# Create an instance of the settings
settings = Settings() 