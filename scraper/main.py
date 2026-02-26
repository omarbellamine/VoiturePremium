"""Main orchestrator for VoiturePremium scrapers."""

import sys
import os
import logging
import argparse

# Add scraper directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import get_connection, init_db, get_listing_count
from export import export_to_json
from config import DB_PATH, JSON_OUTPUT_PATH

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)


def run_scrapers(sources: list[str] = None):
    """Run all or selected scrapers."""
    conn = get_connection(DB_PATH)
    init_db(conn)

    all_sources = ["wandaloo", "moteur", "avito"]
    sources = sources or all_sources

    for source in sources:
        if source not in all_sources:
            logger.warning(f"Unknown source: {source}, skipping")
            continue

        try:
            if source == "wandaloo":
                from scrapers.wandaloo import WandalooScraper
                scraper = WandalooScraper(conn)
            elif source == "moteur":
                from scrapers.moteur import MoteurScraper
                scraper = MoteurScraper(conn)
            elif source == "avito":
                from scrapers.avito import AvitoScraper
                scraper = AvitoScraper(conn)
            else:
                continue

            scraper.run()
        except Exception as e:
            logger.error(f"Failed to run {source} scraper: {e}", exc_info=True)

    total = get_listing_count(conn)
    logger.info(f"Total listings in database: {total}")
    conn.close()

    # Export to JSON
    count = export_to_json(DB_PATH, JSON_OUTPUT_PATH)
    logger.info(f"Exported {count} listings to {JSON_OUTPUT_PATH}")


def main():
    parser = argparse.ArgumentParser(description="VoiturePremium Scraper")
    parser.add_argument(
        "--sources",
        nargs="+",
        choices=["wandaloo", "moteur", "avito"],
        help="Sources to scrape (default: all)",
    )
    parser.add_argument(
        "--export-only",
        action="store_true",
        help="Only export existing DB to JSON (no scraping)",
    )
    args = parser.parse_args()

    if args.export_only:
        export_to_json(DB_PATH, JSON_OUTPUT_PATH)
    else:
        run_scrapers(args.sources)


if __name__ == "__main__":
    main()
