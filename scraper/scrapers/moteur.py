"""Scraper for Moteur.ma - requests + BeautifulSoup.

Site structure:
- Listings: /fr/voiture/achat-voiture-occasion/marque/{slug}/  (offset pagination: /30, /60, etc.)
- Cards: div.ads_info
- Detail pages: /fr/voiture/achat-voiture-occasion/detail-annonce/{id}/{slug}-.html
- Specs: div.detail_line (span for label, span.text_bold for value)
- Phone: span.ca_tt_phone (often masked), AJAX endpoint in div.hidephone[data-url]
"""

import logging
import re
from typing import Optional

from scrapers.base import BaseScraper
from config import MOTEUR_BRAND_SLUGS, MAX_PAGES_PER_BRAND

logger = logging.getLogger(__name__)


class MoteurScraper(BaseScraper):
    source_name = "moteur"

    BASE_URL = "https://www.moteur.ma/fr/voiture/achat-voiture-occasion/marque"

    def scrape(self):
        for brand, slug in MOTEUR_BRAND_SLUGS.items():
            logger.info(f"[moteur] Scraping brand: {brand}")
            self._scrape_brand(brand, slug)

    def _scrape_brand(self, brand: str, slug: str):
        for page in range(MAX_PAGES_PER_BRAND):
            offset = page * 30
            if page == 0:
                url = f"{self.BASE_URL}/{slug}/"
            else:
                url = f"{self.BASE_URL}/{slug}/{offset}"

            logger.info(f"[moteur] Fetching page {page + 1} (offset {offset}): {url}")
            soup = self.fetch(url)
            if not soup:
                break

            cards = soup.select("div.ads_info")
            if not cards:
                logger.info(f"[moteur] No listings on page {page + 1}, stopping")
                break

            for card in cards:
                self._parse_card(brand, card)
                self.delay()

            # Check for next page
            pager = soup.select_one("div.pager")
            if pager:
                next_links = pager.select("a")
                has_next = any("Suivante" in a.get_text() for a in next_links)
                if not has_next:
                    break
            else:
                break

    def _parse_card(self, brand: str, card):
        # Detail URL
        link_el = card.select_one("h3.title_mark_model a.slide")
        if not link_el:
            link_el = card.select_one("a.slide[href*='detail-annonce']")
        if not link_el:
            return

        detail_url = link_el.get("href", "")
        if not detail_url.startswith("http"):
            detail_url = f"https://www.moteur.ma{detail_url}"

        # Title from card
        title = ""
        title_el = card.select_one("h3.title_mark_model")
        if title_el:
            title = title_el.get_text(strip=True)

        # Price from card
        price_text = ""
        price_el = card.select_one("div.price.price_block, div.price.PriceListing")
        if price_el:
            price_text = price_el.get_text(strip=True)

        # Image (lazy loaded)
        image_url = None
        img_el = card.select_one("img.lz_img[data-original]")
        if img_el:
            image_url = img_el.get("data-original", "")
            if not image_url:
                image_url = img_el.get("src", "")
            if image_url and not image_url.startswith("http"):
                image_url = f"https://www.moteur.ma{image_url}"

        # Listing ID
        listing_id = card.get("data-viewstats", "")

        # Fetch detail page
        self._scrape_detail(brand, detail_url, title, price_text, image_url, listing_id)

    def _scrape_detail(self, brand, url, title_fallback, price_fallback,
                       image_fallback, listing_id):
        logger.info(f"[moteur] Fetching detail: {url}")
        soup = self.fetch(url)
        if not soup:
            # Save with card data
            self._save(brand, url, title_fallback, price_fallback,
                       None, None, None, None, None, None, image_fallback, listing_id,
                       None, None)
            return

        # Title from detail
        title = title_fallback
        for h1 in soup.find_all("h1"):
            name_span = h1.select_one("span.text_bold")
            if name_span:
                title = name_span.get_text(strip=True)
                break

        # Price from detail
        price_text = price_fallback
        price_el = soup.select_one("h1 div.price-block")
        if price_el:
            price_text = price_el.get_text(strip=True)

        # Specs from detail_line divs
        specs = {}
        for line in soup.select("div.detail_line"):
            label_el = line.select_one("span.col-md-6")
            value_el = line.select_one("span.text_bold")
            if label_el and value_el:
                key = label_el.get_text(strip=True).lower()
                val = value_el.get_text(strip=True)
                if key and val:
                    specs[key] = val

        year = specs.get("annee") or specs.get("année")
        mileage = specs.get("kilometrage") or specs.get("kilométrage")
        fuel = specs.get("carburant")
        transmission = specs.get("boite de vitesses") or specs.get("boîte de vitesses")

        # City
        city = None
        city_el = soup.select_one("div.opening-hours a[href*='/ville/']")
        if city_el:
            city = city_el.get_text(strip=True)

        # Phone (masked on page, try AJAX endpoint)
        phone = self._extract_phone(soup, listing_id)

        # Images from gallery
        image_url = image_fallback
        gallery_imgs = soup.select("#gallery-wrapper img.image-hb")
        if gallery_imgs:
            img_src = gallery_imgs[0].get("src", "")
            if img_src and not img_src.startswith("http"):
                img_src = f"https://www.moteur.ma{img_src}"
            if img_src:
                image_url = img_src

        # Seller type
        seller_type = None
        seller_link = soup.select_one("a[href*='stock-professionnel']")
        if seller_link:
            seller_type = "Professionnel"

        # Try to extract posting date
        posted_at = None
        date_key = specs.get("date") or specs.get("date de publication") or specs.get("mise en ligne")
        if date_key:
            posted_at = date_key
        else:
            date_el = soup.select_one("span.date_pub, div.date_publication, span.date")
            if date_el:
                posted_at = date_el.get_text(strip=True)

        self._save(brand, url, title, price_text, year, mileage,
                   fuel, transmission, city, phone, image_url, listing_id,
                   seller_type, posted_at)

    def _save(self, brand, url, title, price_text, year, mileage,
              fuel, transmission, city, phone, image_url, listing_id,
              seller_type=None, posted_at=None):
        listing = {
            "url": url,
            "title": title or f"{brand} - Moteur.ma",
            "brand": brand,
            "model": self._extract_model(title, brand),
            "price": self.parse_price(price_text) if price_text else None,
            "year": self.parse_year(str(year)) if year else None,
            "mileage": self.parse_mileage(str(mileage)) if mileage else None,
            "fuel_type": fuel,
            "transmission": transmission,
            "city": city,
            "phone": self.clean_phone(phone) if phone else None,
            "image_url": image_url,
            "seller_type": seller_type,
            "source_id": listing_id or url.rstrip("/").split("/")[-1],
            "posted_at": posted_at,
        }
        self.save_listing(listing)

    def _extract_phone(self, soup, listing_id: str) -> Optional[str]:
        # Try masked phone spans
        phone_spans = soup.select("span.ca_tt_phone")
        for span in phone_spans:
            text = span.get_text(strip=True)
            if text and len(text) >= 6:
                return text  # May be partial like "06621XXXXX"

        # Try AJAX endpoint for full phone
        ajax_el = soup.select_one("div.hidephone[data-url]")
        if ajax_el:
            ajax_url = ajax_el.get("data-url", "")
            if ajax_url:
                if not ajax_url.startswith("http"):
                    ajax_url = f"https://www.moteur.ma{ajax_url}"
                try:
                    resp = self.session.get(ajax_url, timeout=10)
                    if resp.ok:
                        # Response may contain phone number in HTML or text
                        text = resp.text
                        match = re.search(r"0[5-7]\d{8}", text)
                        if match:
                            return match.group()
                except Exception as e:
                    logger.debug(f"[moteur] AJAX phone fetch failed: {e}")

        # tel: links
        tel_link = soup.select_one("a[href^='tel:']")
        if tel_link:
            return tel_link["href"].replace("tel:", "")

        # Regex fallback
        text = soup.get_text()
        match = re.search(r"0[5-7]\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}", text)
        if match:
            return match.group()
        return None

    def _extract_model(self, title: str, brand: str) -> Optional[str]:
        if not title:
            return None
        model = title
        for word in [brand, "MERCEDES-BENZ", "occasion", "à vendre", "maroc", "-", "|"]:
            model = re.sub(re.escape(word), "", model, flags=re.IGNORECASE)
        model = model.strip(" -|,.")
        return model if model else None
