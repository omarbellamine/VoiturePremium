"""Export SQLite listings to JSON for the Next.js frontend."""

import json
import os
import hashlib
import logging
import re
from datetime import datetime, timedelta

from database import get_connection, get_all_listings
from config import DB_PATH, JSON_OUTPUT_PATH

logger = logging.getLogger(__name__)

MAX_AGE_MONTHS = 18


def deduplicate(listings: list[dict]) -> list[dict]:
    """Remove duplicate listings based on title + brand + price similarity."""
    seen = set()
    unique = []

    for listing in listings:
        # Create a dedup key from normalized title + brand + price
        title = (listing.get("title") or "").lower().strip()
        brand = (listing.get("brand") or "").lower().strip()
        price = listing.get("price") or 0

        key = f"{brand}|{title}|{price}"
        key_hash = hashlib.md5(key.encode()).hexdigest()

        if key_hash not in seen:
            seen.add(key_hash)
            unique.append(listing)

    return unique


def filter_stale(listings: list[dict], max_age_months: int = MAX_AGE_MONTHS) -> list[dict]:
    """Remove listings scraped more than max_age_months ago."""
    cutoff = datetime.now() - timedelta(days=max_age_months * 30)
    kept = []
    removed = 0

    for listing in listings:
        scraped = listing.get("scraped_at")
        if scraped:
            try:
                scraped_dt = datetime.strptime(scraped, "%Y-%m-%d %H:%M:%S")
                if scraped_dt < cutoff:
                    removed += 1
                    continue
            except (ValueError, TypeError):
                pass  # Keep if date can't be parsed
        kept.append(listing)

    if removed:
        logger.info(f"Filtered out {removed} listings older than {max_age_months} months")
    return kept


def normalize_date(date_str: str | None) -> str | None:
    """Normalize dates to YYYY-MM-DD HH:MM:SS format for JavaScript compatibility."""
    if not date_str or not isinstance(date_str, str):
        return None

    date_str = date_str.strip()

    # Already in YYYY-MM-DD HH:MM:SS format
    try:
        datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S")
        return date_str
    except ValueError:
        pass

    # DD-MM-YYYY format (Moteur.ma)
    match = re.match(r"^(\d{1,2})-(\d{1,2})-(\d{4})$", date_str)
    if match:
        day, month, year = match.groups()
        return f"{year}-{month.zfill(2)}-{day.zfill(2)} 00:00:00"

    # DD/MM/YYYY format
    match = re.match(r"^(\d{1,2})/(\d{1,2})/(\d{4})$", date_str)
    if match:
        day, month, year = match.groups()
        return f"{year}-{month.zfill(2)}-{day.zfill(2)} 00:00:00"

    # French relative dates (leftover from Avito)
    rel_match = re.search(r"il y a\s+(\d+)\s+(minute|heure|jour|semaine|mois)", date_str, re.IGNORECASE)
    if rel_match:
        amount = int(rel_match.group(1))
        unit = rel_match.group(2).lower()
        now = datetime.now()
        if "minute" in unit:
            dt = now - timedelta(minutes=amount)
        elif "heure" in unit:
            dt = now - timedelta(hours=amount)
        elif "jour" in unit:
            dt = now - timedelta(days=amount)
        elif "semaine" in unit:
            dt = now - timedelta(weeks=amount)
        elif "mois" in unit:
            dt = now - timedelta(days=amount * 30)
        else:
            return None
        return dt.strftime("%Y-%m-%d %H:%M:%S")

    if "hier" in date_str.lower():
        return (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d %H:%M:%S")

    if "aujourd" in date_str.lower():
        return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Can't parse — drop it
    return None


PLACEHOLDER_IMAGES = {
    "annonce-sans-photo",
    "no-photo",
    "no-image",
    "placeholder",
    "default-car",
}


def filter_no_image(listings: list[dict]) -> list[dict]:
    """Remove listings without a real image (including placeholder images)."""
    kept = []
    removed = 0

    for listing in listings:
        img = (listing.get("image_url") or "").strip()
        if not img:
            removed += 1
            continue
        # Filter out known placeholder images
        img_lower = img.lower()
        if any(ph in img_lower for ph in PLACEHOLDER_IMAGES):
            removed += 1
            continue
        kept.append(listing)

    if removed:
        logger.info(f"Filtered out {removed} listings without real images")
    return kept


def export_to_json(db_path: str = None, output_path: str = None):
    """Export all listings from SQLite to a JSON file."""
    db_path = db_path or DB_PATH
    output_path = output_path or JSON_OUTPUT_PATH

    conn = get_connection(db_path)
    listings = get_all_listings(conn)
    conn.close()

    logger.info(f"Total listings from DB: {len(listings)}")

    # Deduplicate
    listings = deduplicate(listings)
    logger.info(f"After deduplication: {len(listings)}")

    # Filter out stale listings (older than 18 months)
    listings = filter_stale(listings)
    logger.info(f"After age filter: {len(listings)}")

    # Filter out listings without images
    listings = filter_no_image(listings)
    logger.info(f"After image filter: {len(listings)}")

    # Assign frontend IDs and clean up
    export_data = []
    for i, listing in enumerate(listings, 1):
        export_data.append({
            "id": str(i),
            "source": listing.get("source"),
            "url": listing.get("url"),
            "title": listing.get("title"),
            "brand": listing.get("brand"),
            "model": listing.get("model"),
            "price": listing.get("price"),
            "year": listing.get("year"),
            "mileage": listing.get("mileage"),
            "fuelType": listing.get("fuel_type"),
            "transmission": listing.get("transmission"),
            "city": listing.get("city"),
            "phone": listing.get("phone"),
            "imageUrl": listing.get("image_url"),
            "sellerType": listing.get("seller_type"),
            "postedAt": normalize_date(listing.get("posted_at")),
            "description": listing.get("description"),
            "scrapedAt": listing.get("scraped_at"),
        })

    # Write JSON
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(export_data, f, ensure_ascii=False, indent=2)

    logger.info(f"Exported {len(export_data)} listings to {output_path}")
    return len(export_data)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    export_to_json()
