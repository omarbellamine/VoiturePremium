"""Scraper for Avito.ma - Playwright (headless browser).

Avito is a Next.js React SPA. The most reliable data extraction method is
parsing the __NEXT_DATA__ JSON blob embedded in each page, which contains
all listing data including phone numbers, prices, and images.

Listing URL: /fr/maroc/voitures-%C3%A0_vendre?brand_slug={slug}&o={page}
Data path (listing): props.pageProps.componentProps.ads.ads
Data path (detail):  props.pageProps.componentProps.adInfo.ad
"""

import json
import logging
import re
from datetime import datetime, timedelta
from typing import Optional

from scrapers.base import BaseScraper
from config import AVITO_BRAND_SLUGS, MAX_PAGES_PER_BRAND

logger = logging.getLogger(__name__)


class AvitoScraper(BaseScraper):
    source_name = "avito"

    LISTING_URL = "https://www.avito.ma/fr/maroc/voitures-%C3%A0_vendre"

    def scrape(self):
        from playwright.sync_api import sync_playwright

        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(
                user_agent=(
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/120.0.0.0 Safari/537.36"
                ),
                locale="fr-FR",
            )
            page = context.new_page()

            for brand, slug in AVITO_BRAND_SLUGS.items():
                logger.info(f"[avito] Scraping brand: {brand}")
                self._scrape_brand(page, brand, slug)

            browser.close()

    def _scrape_brand(self, page, brand: str, slug: str):
        for pg in range(1, MAX_PAGES_PER_BRAND + 1):
            url = f"{self.LISTING_URL}?brand_slug={slug}"
            if pg > 1:
                url += f"&o={pg}"

            logger.info(f"[avito] Loading page {pg}: {url}")
            try:
                page.goto(url, wait_until="domcontentloaded", timeout=45000)
                # Wait for __NEXT_DATA__ script to be attached (it's hidden by nature)
                page.wait_for_selector("script#__NEXT_DATA__", state="attached", timeout=15000)
            except Exception as e:
                logger.error(f"[avito] Page load error: {e}")
                break

            # Extract data from __NEXT_DATA__
            data = self._extract_next_data(page)
            if not data:
                logger.warning(f"[avito] No __NEXT_DATA__ found on page {pg}")
                break

            try:
                ads = data["props"]["pageProps"]["componentProps"]["ads"]["ads"]
                total = data["props"]["pageProps"]["componentProps"]["ads"].get("totalListingAds", 0)
            except (KeyError, TypeError):
                logger.warning(f"[avito] Could not extract ads from __NEXT_DATA__")
                break

            if not ads:
                logger.info(f"[avito] No ads on page {pg}, stopping")
                break

            logger.info(f"[avito] Found {len(ads)} ads on page {pg} (total: {total})")

            for ad in ads:
                self._parse_ad(brand, ad)

            self.delay()

    def _extract_next_data(self, page) -> Optional[dict]:
        try:
            result = page.evaluate("""() => {
                const script = document.querySelector('script#__NEXT_DATA__');
                return script ? JSON.parse(script.textContent) : null;
            }""")
            return result
        except Exception as e:
            logger.error(f"[avito] Failed to extract __NEXT_DATA__: {e}")
            return None

    def _parse_ad(self, search_brand: str, ad: dict):
        try:
            ad_id = str(ad.get("listId") or ad.get("id", ""))
            title = ad.get("subject", "")
            detail_url = ad.get("href", "")

            # Extract actual brand from ad params or title
            actual_brand = None
            params = ad.get("params", {})
            for param in params.get("primary", []):
                if param.get("key") == "brand":
                    actual_brand = param.get("value")
                    break

            # Try to detect brand from title if not in params
            brand = search_brand
            if actual_brand:
                normalized = self.normalize_brand(actual_brand)
                if normalized:
                    brand = normalized
                else:
                    # Non-premium brand, skip
                    return
            else:
                # No brand param, try to detect from title
                detected = self.normalize_brand(title)
                if detected:
                    brand = detected
                else:
                    # Can't confirm this is a premium brand, skip
                    return

            # Price
            price = None
            price_data = ad.get("price")
            if price_data and isinstance(price_data, dict):
                price = price_data.get("value")

            # Phone
            phone = None
            seller = ad.get("seller")
            if seller and isinstance(seller, dict):
                phone_data = seller.get("phone")
                if phone_data and isinstance(phone_data, dict):
                    phone = phone_data.get("number")

            # Images
            image_url = ad.get("defaultImage")
            images = ad.get("images", [])
            if images and not image_url:
                image_url = images[0]

            # Location
            location = ad.get("location", "")
            city = location.split(",")[0].strip() if location else None

            # Description text from seller
            description = ad.get("body") or ad.get("description") or ad.get("text") or ""

            # Params (year, fuel, transmission, mileage)
            year = None
            fuel = None
            transmission = None
            mileage = None

            params = ad.get("params", {})
            # Check all param sections for all fields
            all_params = (
                params.get("primary", []) +
                params.get("secondary", []) +
                params.get("extra", [])
            )
            for param in all_params:
                key = (param.get("key") or "").lower()
                value = param.get("value")
                if value is None or value == "":
                    continue
                if key == "regdate":
                    year = value
                elif key == "fuel":
                    fuel = value
                elif key in ("bv", "gearbox", "transmission"):
                    transmission = value
                elif key in ("mileage_exact", "mileage", "km", "kilometrage",
                             "odometer", "kilometres"):
                    mileage = str(value)

            if not mileage:
                logger.debug(f"[avito] No mileage found for '{title}', params: "
                             f"{[(p.get('key'), p.get('value')) for p in all_params]}")

            # Seller type
            seller_type = None
            if seller and isinstance(seller, dict):
                stype = seller.get("type", "")
                if stype == "STORE":
                    seller_type = "Professionnel"
                elif stype:
                    seller_type = "Particulier"

            # Posted date
            posted_at = None
            date_val = ad.get("date")
            if date_val:
                if isinstance(date_val, str):
                    posted_at = self._parse_relative_date(date_val)
                elif isinstance(date_val, dict):
                    raw = date_val.get("timestamp") or date_val.get("date") or ""
                    posted_at = self._parse_relative_date(str(raw)) if raw else None
            if not posted_at:
                for date_key in ("time", "createdAt", "publishedAt",
                                 "created_at", "published_at", "listTime",
                                 "creation_date", "dateInserted"):
                    val = ad.get(date_key)
                    if val and isinstance(val, str):
                        posted_at = self._parse_relative_date(val)
                        if posted_at:
                            break

            listing = {
                "url": detail_url,
                "title": title or f"{brand} - Avito",
                "brand": brand,
                "model": self._extract_model(title, brand),
                "price": int(price) if price else None,
                "year": self.parse_year(str(year)) if year else None,
                "mileage": self.parse_mileage(mileage) if mileage else None,
                "fuel_type": fuel,
                "transmission": transmission,
                "city": city,
                "phone": self.clean_phone(str(phone)) if phone else None,
                "image_url": image_url,
                "seller_type": seller_type,
                "source_id": ad_id,
                "posted_at": posted_at,
                "description": description.strip() if description else None,
            }
            self.save_listing(listing)

        except Exception as e:
            logger.error(f"[avito] Error parsing ad: {e}", exc_info=True)

    @staticmethod
    def _parse_relative_date(text: str) -> Optional[str]:
        """Convert French relative dates like 'il y a 2 heures' to ISO timestamps."""
        if not text:
            return None

        # Already a valid date format (e.g. 2026-02-27 01:25:52)
        try:
            datetime.strptime(text, "%Y-%m-%d %H:%M:%S")
            return text
        except ValueError:
            pass

        # Parse French relative time: "il y a X minutes/heures/jours"
        match = re.search(r"il y a\s+(\d+)\s+(minute|heure|jour|semaine|mois)", text, re.IGNORECASE)
        if match:
            amount = int(match.group(1))
            unit = match.group(2).lower()
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

        # "hier" = yesterday
        if "hier" in text.lower():
            dt = datetime.now() - timedelta(days=1)
            return dt.strftime("%Y-%m-%d %H:%M:%S")

        # "aujourd'hui" = today
        if "aujourd" in text.lower():
            return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        return text  # Return as-is, frontend will validate

    def _extract_model(self, title: str, brand: str) -> Optional[str]:
        if not title:
            return None
        model = title
        for word in [brand, "occasion", "à vendre", "maroc", "-", "|"]:
            model = re.sub(re.escape(word), "", model, flags=re.IGNORECASE)
        model = model.strip(" -|,.")
        return model if model else None
