from pydantic_settings import BaseSettings, SettingsConfigDict


class Sett(BaseSettings):
    dbHost: str
    dbPort: int
    dbName: str
    dbUser: str
    dbPass: str

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8"
    )


sett = Sett()