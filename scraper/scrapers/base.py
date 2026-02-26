"""Abstract base scraper class."""

import time
import random
import logging
import re
from abc import ABC, abstractmethod
from typing import Optional

import requests
from bs4 import BeautifulSoup

from config import USER_AGENT, REQUEST_TIMEOUT, REQUEST_DELAY, PREMIUM_BRANDS
from database import upsert_listing

logger = logging.getLogger(__name__)


class BaseScraper(ABC):
    """Base class for all site scrapers."""

    source_name: str = ""

    def __init__(self, conn):
        self.conn = conn
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": USER_AGENT,
            "Accept-Language": "fr-FR,fr;q=0.9",
        })
        self.new_count = 0
        self.updated_count = 0

    def delay(self):
        time.sleep(random.uniform(*REQUEST_DELAY))

    def fetch(self, url: str) -> Optional[BeautifulSoup]:
        try:
            resp = self.session.get(url, timeout=REQUEST_TIMEOUT)
            resp.raise_for_status()
            return BeautifulSoup(resp.text, "lxml")
        except requests.RequestException as e:
            logger.error(f"[{self.source_name}] Failed to fetch {url}: {e}")
            return None

    def save_listing(self, listing: dict):
        listing["source"] = self.source_name
        is_new = upsert_listing(self.conn, listing)
        if is_new:
            self.new_count += 1
        else:
            self.updated_count += 1

    def normalize_brand(self, text: str) -> Optional[str]:
        text_lower = text.lower().strip()
        for brand in PREMIUM_BRANDS:
            if brand.lower() in text_lower:
                return brand
        return None

    @staticmethod
    def parse_price(text: str) -> Optional[int]:
        if not text:
            return None
        digits = re.sub(r"[^\d]", "", text)
        if digits:
            return int(digits)
        return None

    @staticmethod
    def parse_year(text: str) -> Optional[int]:
        if not text:
            return None
        match = re.search(r"(19|20)\d{2}", text)
        if match:
            return int(match.group())
        return None

    @staticmethod
    def parse_mileage(text: str) -> Optional[int]:
        if not text:
            return None
        digits = re.sub(r"[^\d]", "", text)
        if digits:
            return int(digits)
        return None

    @staticmethod
    def clean_phone(text: str) -> Optional[str]:
        if not text:
            return None
        digits = re.sub(r"[^\d+]", "", text)
        if len(digits) >= 10:
            return digits
        return None

    @abstractmethod
    def scrape(self):
        """Run the scraper. Must be implemented by subclasses."""
        pass

    def run(self):
        logger.info(f"[{self.source_name}] Starting scrape...")
        try:
            self.scrape()
        except Exception as e:
            logger.error(f"[{self.source_name}] Scrape failed: {e}", exc_info=True)
        logger.info(
            f"[{self.source_name}] Done. "
            f"New: {self.new_count}, Updated: {self.updated_count}"
        )
