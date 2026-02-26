"""Export SQLite listings to JSON for the Next.js frontend."""

import json
import os
import hashlib
import logging
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


def filter_no_image(listings: list[dict]) -> list[dict]:
    """Remove listings without an image."""
    kept = []
    removed = 0

    for listing in listings:
        img = listing.get("image_url")
        if img and img.strip():
            kept.append(listing)
        else:
            removed += 1

    if removed:
        logger.info(f"Filtered out {removed} listings without images")
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
            "postedAt": listing.get("posted_at"),
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
