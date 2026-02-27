import { Listing, Filters } from "./types";

export function applyFilters(listings: Listing[], filters: Filters): Listing[] {
  let result = [...listings];

  // Search
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (l) =>
        l.title?.toLowerCase().includes(q) ||
        l.brand?.toLowerCase().includes(q) ||
        l.model?.toLowerCase().includes(q) ||
        l.city?.toLowerCase().includes(q)
    );
  }

  // Brand
  if (filters.brand) {
    result = result.filter((l) => l.brand === filters.brand);
  }

  // City
  if (filters.city) {
    result = result.filter((l) => l.city === filters.city);
  }

  // Fuel type
  if (filters.fuelType) {
    result = result.filter((l) => l.fuelType === filters.fuelType);
  }

  // Year range
  if (filters.yearMin) {
    const min = parseInt(filters.yearMin);
    result = result.filter((l) => l.year && l.year >= min);
  }
  if (filters.yearMax) {
    const max = parseInt(filters.yearMax);
    result = result.filter((l) => l.year && l.year <= max);
  }

  // Price range (use estimated price as fallback)
  if (filters.priceMin) {
    const min = parseInt(filters.priceMin);
    result = result.filter((l) => {
      const p = l.price || l.estimatedPrice;
      return p && p >= min;
    });
  }
  if (filters.priceMax) {
    const max = parseInt(filters.priceMax);
    result = result.filter((l) => {
      const p = l.price || l.estimatedPrice;
      return p && p <= max;
    });
  }

  // Deal score minimum
  if (filters.dealScoreMin) {
    const min = parseFloat(filters.dealScoreMin);
    result = result.filter((l) => l.dealScore != null && l.dealScore >= min);
  }

  // Sort
  result = sortListings(result, filters.sortBy);

  return result;
}

function sortListings(listings: Listing[], sortBy: string): Listing[] {
  switch (sortBy) {
    case "deal_desc":
      return listings.sort((a, b) => (b.dealScore || 0) - (a.dealScore || 0));
    case "price_asc":
      return listings.sort((a, b) => (a.price || a.estimatedPrice || 0) - (b.price || b.estimatedPrice || 0));
    case "price_desc":
      return listings.sort((a, b) => (b.price || b.estimatedPrice || 0) - (a.price || a.estimatedPrice || 0));
    case "year_asc":
      return listings.sort((a, b) => (a.year || 0) - (b.year || 0));
    case "year_desc":
      return listings.sort((a, b) => (b.year || 0) - (a.year || 0));
    case "mileage_asc":
      return listings.sort((a, b) => (a.mileage || 0) - (b.mileage || 0));
    case "date_asc":
      return listings.sort(
        (a, b) =>
          new Date(a.scrapedAt || 0).getTime() -
          new Date(b.scrapedAt || 0).getTime()
      );
    case "date_desc":
    default:
      return listings.sort(
        (a, b) =>
          new Date(b.scrapedAt || 0).getTime() -
          new Date(a.scrapedAt || 0).getTime()
      );
  }
}
