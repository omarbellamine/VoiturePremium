"""Scraper for Wandaloo.com - requests + BeautifulSoup.

Site structure:
- Listings use query params: /occasion/?marque={id}&pg={page}
- Cards: div#result ul.items > li
- Detail pages: /occasion/{slug}/{id}.html
- Specs: ul.icons > li (p.titre + p.tag), ul.params > li (p.param + p.value)
- Phone: regex in page text
"""

import logging
import re
from typing import Optional

from scrapers.base import BaseScraper
from config import WANDALOO_BRAND_IDS, MAX_PAGES_PER_BRAND

logger = logging.getLogger(__name__)


class WandalooScraper(BaseScraper):
    source_name = "wandaloo"

    BASE_URL = "https://www.wandaloo.com/occasion/"

    def scrape(self):
        for brand, brand_id in WANDALOO_BRAND_IDS.items():
            logger.info(f"[wandaloo] Scraping brand: {brand}")
            self._scrape_brand(brand, brand_id)

    def _scrape_brand(self, brand: str, brand_id: str):
        for page in range(1, MAX_PAGES_PER_BRAND + 1):
            url = (
                f"{self.BASE_URL}?marque={brand_id}&modele=0&budget=0"
                f"&categorie=0&moteur=0&transmission=0&vendeur=0"
                f"&abonne=0&equipement=-&ville=0&mo=za&pg={page}"
            )

            logger.info(f"[wandaloo] Fetching page {page}: {url}")
            soup = self.fetch(url)
            if not soup:
                break

            cards = soup.select("div#result ul.items > li")
            if not cards:
                logger.info(f"[wandaloo] No listings on page {page}, stopping")
                break

            for card in cards:
                self._parse_card(brand, card)
                self.delay()

            # Check if there's a next page
            next_page = soup.select_one("ul.pages li a.page")
            if not next_page:
                break

    def _parse_card(self, brand: str, card):
        # Detail URL from title link
        title_link = card.select_one("p.titre a")
        if not title_link:
            return

        detail_url = title_link.get("href", "")
        if not detail_url.startswith("http"):
            detail_url = f"https://www.wandaloo.com{detail_url}"

        # Skip non-detail links (filters, generic pages)
        if ".html" not in detail_url:
            return

        title = title_link.get_text(strip=True)

        # Price from card
        price_text = ""
        price_el = card.select_one("p.prix span")
        if price_el:
            price_text = price_el.get_text(strip=True)

        # City from card
        city = ""
        city_el = card.select_one("p.infos span.city")
        if city_el:
            city = city_el.get_text(strip=True)

        # Image from card
        image_url = None
        img_el = card.select_one("a.img img")
        if img_el:
            image_url = img_el.get("src", "")
            if image_url and not image_url.startswith("http"):
                image_url = f"https://www.wandaloo.com{image_url}"

        # Specs from card (fuel, year, cv, km)
        specs = card.select("ul.detail li")
        fuel_type = specs[0].get_text(strip=True) if len(specs) > 0 else None
        year_text = specs[1].get_text(strip=True) if len(specs) > 1 else None
        mileage_text = specs[3].get_text(strip=True) if len(specs) > 3 else None

        # Now fetch the detail page for phone number and richer data
        self._scrape_detail(
            brand, detail_url, title, price_text, city,
            image_url, fuel_type, year_text, mileage_text
        )

    def _scrape_detail(self, brand, url, title, price_text, city,
                       image_url, fuel_type, year_text, mileage_text):
        logger.info(f"[wandaloo] Fetching detail: {url}")
        soup = self.fetch(url)
        if not soup:
            # Save with card data only
            self._save(brand, url, title, price_text, city,
                       image_url, fuel_type, year_text, mileage_text,
                       None, None, None)
            return

        # Override with detail page data if available
        h1 = soup.select_one("div#annonce h1")
        if h1:
            title = h1.get_text(strip=True)

        price_el = soup.select_one("div#details p.prix")
        if price_el:
            price_text = price_el.get_text(strip=True)

        # Extract specs from icon grid
        specs = {}
        for li in soup.select("ul.icons.clearfix > li"):
            label_el = li.select_one("p.titre")
            value_el = li.select_one("p.tag")
            if label_el and value_el:
                specs[label_el.get_text(strip=True).lower()] = value_el.get_text(strip=True)

        # Extract from params table
        for li in soup.select("ul.params.my-panel > li"):
            label_el = li.select_one("p.param")
            value_el = li.select_one("p.value")
            if label_el and value_el:
                specs[label_el.get_text(strip=True).lower()] = value_el.get_text(strip=True)

        if "ville" in specs:
            city = specs["ville"]
        if "carburant" in specs:
            fuel_type = specs["carburant"]
        if "kilometrage" in specs or "kilométrage" in specs:
            mileage_text = specs.get("kilometrage") or specs.get("kilométrage") or mileage_text

        year = specs.get("modele") or specs.get("mise en circulation") or year_text
        transmission = specs.get("transmision") or specs.get("transmission")

        # Better image from detail page gallery
        gallery_img = soup.select_one("div.popup-gallery > a img")
        if gallery_img:
            img_src = gallery_img.get("src", "")
            if img_src and not img_src.startswith("http"):
                img_src = f"https://www.wandaloo.com{img_src}"
            if img_src:
                image_url = img_src

        # Phone number
        phone = self._extract_phone(soup)

        # Try to extract posting date
        posted_at = None
        date_key = specs.get("date") or specs.get("date de publication") or specs.get("publiée le")
        if date_key:
            posted_at = date_key
        else:
            # Look for date in page info text
            info_el = soup.select_one("p.infos span.date, span.date, div.date")
            if info_el:
                posted_at = info_el.get_text(strip=True)

        self._save(brand, url, title, price_text, city,
                   image_url, fuel_type, year, mileage_text,
                   phone, transmission, posted_at)

    def _save(self, brand, url, title, price_text, city,
              image_url, fuel_type, year_text, mileage_text,
              phone, transmission=None, posted_at=None):
        listing = {
            "url": url,
            "title": title or f"{brand} - Wandaloo",
            "brand": brand,
            "model": self._extract_model(title, brand),
            "price": self.parse_price(price_text) if price_text else None,
            "year": self.parse_year(str(year_text)) if year_text else None,
            "mileage": self.parse_mileage(str(mileage_text)) if mileage_text else None,
            "fuel_type": fuel_type,
            "transmission": transmission,
            "city": city or None,
            "phone": self.clean_phone(phone) if phone else None,
            "image_url": image_url,
            "seller_type": None,
            "source_id": url.rstrip("/").split("/")[-1].replace(".html", ""),
            "posted_at": posted_at,
        }
        self.save_listing(listing)

    def _extract_phone(self, soup) -> Optional[str]:
        # tel: links
        tel_link = soup.select_one("a[href^='tel:']")
        if tel_link:
            return tel_link["href"].replace("tel:", "")

        # Regex in full page text
        text = soup.get_text()
        patterns = [
            r"0[5-7]\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}",
            r"\+212[\s.-]?\d[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}",
        ]
        for pattern in patterns:
            match = re.search(pattern, text)
            if match:
                return match.group()
        return None

    def _extract_model(self, title: str, brand: str) -> Optional[str]:
        if not title:
            return None
        model = title
        for word in [brand, "Mercedes", "MERCEDES", "occasion", "à vendre",
                     "maroc", "-", "|", "Wandaloo"]:
            model = re.sub(re.escape(word), "", model, flags=re.IGNORECASE)
        model = re.sub(r"\d{4,}", "", model)  # Remove years
        model = model.strip(" -|,.")
        return model if model else None
