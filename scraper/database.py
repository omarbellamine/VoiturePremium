"""SQLite database schema and CRUD operations."""

import sqlite3
import os
from typing import Optional


def get_connection(db_path: str = None) -> sqlite3.Connection:
    if db_path is None:
        from config import DB_PATH
        db_path = DB_PATH
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn


def init_db(conn: sqlite3.Connection):
    conn.execute("""
        CREATE TABLE IF NOT EXISTS listings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source TEXT NOT NULL,
            source_id TEXT,
            url TEXT NOT NULL UNIQUE,
            title TEXT,
            brand TEXT,
            model TEXT,
            price INTEGER,
            year INTEGER,
            mileage INTEGER,
            fuel_type TEXT,
            transmission TEXT,
            city TEXT,
            phone TEXT,
            image_url TEXT,
            seller_type TEXT,
            posted_at TEXT,
            scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.execute("""
        CREATE INDEX IF NOT EXISTS idx_listings_brand ON listings(brand)
    """)
    conn.execute("""
        CREATE INDEX IF NOT EXISTS idx_listings_source ON listings(source)
    """)
    conn.commit()


def upsert_listing(conn: sqlite3.Connection, listing: dict) -> bool:
    """Insert or update a listing. Returns True if new, False if updated."""
    existing = conn.execute(
        "SELECT id FROM listings WHERE url = ?", (listing["url"],)
    ).fetchone()

    if existing:
        conn.execute("""
            UPDATE listings SET
                title = ?, brand = ?, model = ?, price = ?, year = ?,
                mileage = ?, fuel_type = ?, transmission = ?, city = ?,
                phone = ?, image_url = ?, seller_type = ?, posted_at = COALESCE(?, posted_at),
                scraped_at = CURRENT_TIMESTAMP
            WHERE url = ?
        """, (
            listing.get("title"), listing.get("brand"), listing.get("model"),
            listing.get("price"), listing.get("year"), listing.get("mileage"),
            listing.get("fuel_type"), listing.get("transmission"),
            listing.get("city"), listing.get("phone"), listing.get("image_url"),
            listing.get("seller_type"), listing.get("posted_at"), listing["url"],
        ))
        conn.commit()
        return False
    else:
        conn.execute("""
            INSERT INTO listings (
                source, source_id, url, title, brand, model, price, year,
                mileage, fuel_type, transmission, city, phone, image_url,
                seller_type, posted_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            listing.get("source"), listing.get("source_id"), listing["url"],
            listing.get("title"), listing.get("brand"), listing.get("model"),
            listing.get("price"), listing.get("year"), listing.get("mileage"),
            listing.get("fuel_type"), listing.get("transmission"),
            listing.get("city"), listing.get("phone"), listing.get("image_url"),
            listing.get("seller_type"), listing.get("posted_at"),
        ))
        conn.commit()
        return True


def get_all_listings(conn: sqlite3.Connection) -> list[dict]:
    rows = conn.execute("""
        SELECT * FROM listings ORDER BY scraped_at DESC
    """).fetchall()
    return [dict(row) for row in rows]


def get_listing_count(conn: sqlite3.Connection) -> int:
    return conn.execute("SELECT COUNT(*) FROM listings").fetchone()[0]


def clear_source(conn: sqlite3.Connection, source: str):
    """Remove all listings from a given source before re-scraping."""
    conn.execute("DELETE FROM listings WHERE source = ?", (source,))
    conn.commit()
