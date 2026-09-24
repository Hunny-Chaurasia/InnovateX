from pydantic import HttpUrl, field_validator

def normalize_url(value: str) -> str:
    return value if value.startswith(("http://", "https://")) else f"https://{value}"

def validate_url(value: str) -> str:
    normalized = normalize_url(value)
    HttpUrl(normalized)
    return normalized
