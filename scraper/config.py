"""Configuration for VoiturePremium scrapers."""

PREMIUM_BRANDS = [
    "Mercedes-Benz",
    "BMW",
    "Audi",
    "Porsche",
    "Land Rover",
    "Range Rover",
    "Jaguar",
    "Maserati",
    "Bentley",
    "Ferrari",
    "Lamborghini",
    "Rolls-Royce",
    "Aston Martin",
    "McLaren",
    "Lexus",
    "Infiniti",
    "Tesla",
    "Volvo",
    "Mini",
    "Alfa Romeo",
    "DS",
]

# Avito uses brand_slug query parameter (lowercase, hyphenated)
AVITO_BRAND_SLUGS = {
    "Mercedes-Benz": "mercedes-benz",
    "BMW": "bmw",
    "Audi": "audi",
    "Porsche": "porsche",
    "Land Rover": "land-rover",
    "Range Rover": "land-rover",
    "Jaguar": "jaguar",
    "Maserati": "maserati",
    "Bentley": "bentley",
    "Ferrari": "ferrari",
    "Lamborghini": "lamborghini",
    "Rolls-Royce": "rolls-royce",
    "Aston Martin": "aston-martin",
    "McLaren": "mclaren",
    "Lexus": "lexus",
    "Infiniti": "infiniti",
    "Tesla": "tesla",
    "Volvo": "volvo",
    "Mini": "mini",
    "Alfa Romeo": "alfa-romeo",
    "DS": "ds",
}

# Wandaloo uses numeric brand IDs in query params
WANDALOO_BRAND_IDS = {
    "Mercedes-Benz": "32",
    "BMW": "6",
    "Audi": "3",
    "Porsche": "38",
    "Land Rover": "26",
    "Range Rover": "26",
    "Jaguar": "21",
    "Maserati": "5",
    "Bentley": "4",
    "Ferrari": "14",
    "Lamborghini": "25",
    "Rolls-Royce": "41",
    "Aston Martin": "2",
    "McLaren": "30",
    "Lexus": "27",
    "Infiniti": "19",
    "Tesla": "47",
    "Volvo": "50",
    "Mini": "33",
    "Alfa Romeo": "1",
    "DS": "12",
}

# Moteur.ma uses /marque/{slug}/ path segments
MOTEUR_BRAND_SLUGS = {
    "Mercedes-Benz": "mercedes-benz",
    "BMW": "bmw",
    "Audi": "audi",
    "Porsche": "porsche",
    "Land Rover": "land-rover",
    "Range Rover": "range-rover",
    "Jaguar": "jaguar",
    "Maserati": "maserati",
    "Bentley": "bentley",
    "Ferrari": "ferrari",
    "Lamborghini": "lamborghini",
    "Rolls-Royce": "rolls-royce",
    "Aston Martin": "aston-martin",
    "McLaren": "mclaren",
    "Lexus": "lexus",
    "Infiniti": "infiniti",
    "Tesla": "tesla",
    "Volvo": "volvo",
    "Mini": "mini",
    "Alfa Romeo": "alfa-romeo",
    "DS": "ds",
}

# Scraper settings
REQUEST_TIMEOUT = 30
REQUEST_DELAY = (1, 3)  # Random delay range in seconds between requests
MAX_PAGES_PER_BRAND = 5  # Max pagination pages per brand

USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/120.0.0.0 Safari/537.36"
)

import os as _os

_PROJECT_ROOT = _os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))

DB_PATH = _os.path.join(_PROJECT_ROOT, "data", "voiturepremium.db")
JSON_OUTPUT_PATH = _os.path.join(_PROJECT_ROOT, "frontend", "public", "data", "listings.json")
