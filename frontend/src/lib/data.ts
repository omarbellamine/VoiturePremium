import { Listing } from "./types";
import listingsJson from "../../public/data/listings.json";

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

function estimatePrices(listings: Listing[]): Listing[] {
  const withPrices = listings.filter((l) => l.price && l.price > 0);

  // Brand-level medians as fallback
  const brandMedians = new Map<string, number>();
  const brandGroups = new Map<string, number[]>();
  for (const l of withPrices) {
    const key = l.brand.toLowerCase();
    if (!brandGroups.has(key)) brandGroups.set(key, []);
    brandGroups.get(key)!.push(l.price!);
  }
  brandGroups.forEach((prices, brand) => {
    brandMedians.set(brand, median(prices));
  });

  return listings.map((l) => {
    if (l.price && l.price > 0) return l;

    // Find similar: same brand, year ±3, same fuelType
    const similar = withPrices.filter((s) => {
      if (s.brand.toLowerCase() !== l.brand.toLowerCase()) return false;
      if (l.year && s.year && Math.abs(s.year - l.year) > 3) return false;
      if (l.fuelType && s.fuelType && s.fuelType !== l.fuelType) return false;
      return true;
    });

    let estimated: number | undefined;
    if (similar.length >= 3) {
      estimated = median(similar.map((s) => s.price!));
    } else {
      estimated = brandMedians.get(l.brand.toLowerCase());
    }

    if (estimated) {
      // Round to nearest 5000
      estimated = Math.round(estimated / 5000) * 5000;
      return { ...l, estimatedPrice: estimated };
    }
    return l;
  });
}

const PREMIUM_BRANDS = new Set([
  "mercedes-benz", "bmw", "audi", "range rover", "porsche",
  "land rover", "jaguar", "lexus", "volvo", "maserati",
  "bentley", "ferrari", "lamborghini", "rolls-royce",
]);

export function getRecommendedListing(listings: Listing[]): Listing | null {
  // Only consider listings with a real image and a real price
  const candidates = listings.filter(
    (l) => l.imageUrl && l.imageUrl.startsWith("http") && l.price && l.price > 0
  );
  if (candidates.length === 0) return null;

  let best: Listing | null = null;
  let bestScore = -1;

  for (const l of candidates) {
    let score = 0;
    if (l.phone) score += 1;
    if (PREMIUM_BRANDS.has(l.brand.toLowerCase())) score += 2;
    if (l.year && l.year >= new Date().getFullYear() - 3) score += 1;
    if (l.mileage) score += 0.5;
    if (l.city) score += 0.5;
    if (l.model) score += 0.5;
    if (l.fuelType) score += 0.5;
    if (l.dealScore && l.dealScore >= 7) score += 1;

    if (score > bestScore) {
      bestScore = score;
      best = l;
    }
  }

  return best;
}

function computeDealScores(listings: Listing[]): Listing[] {
  // Build brand-level price medians for value comparison
  const brandPrices = new Map<string, number[]>();
  for (const l of listings) {
    const p = l.price || l.estimatedPrice;
    if (!p) continue;
    const key = l.brand.toLowerCase();
    if (!brandPrices.has(key)) brandPrices.set(key, []);
    brandPrices.get(key)!.push(p);
  }
  const brandMedians = new Map<string, number>();
  brandPrices.forEach((prices, brand) => {
    brandMedians.set(brand, median(prices));
  });

  const currentYear = new Date().getFullYear();

  return listings.map((l) => {
    const price = l.price || l.estimatedPrice;

    // 1. Price value (0-3): how good is the price vs market
    let priceValue = 1.5; // default neutral
    if (price) {
      const brandMed = brandMedians.get(l.brand.toLowerCase());
      if (brandMed && brandMed > 0) {
        const ratio = price / brandMed;
        if (ratio <= 0.7) priceValue = 3;
        else if (ratio <= 0.85) priceValue = 2.5;
        else if (ratio <= 1.0) priceValue = 2;
        else if (ratio <= 1.15) priceValue = 1.5;
        else if (ratio <= 1.3) priceValue = 1;
        else priceValue = 0.5;
      }
    }

    // 2. Mileage risk (0-2): lower = better
    let mileageRisk = 1; // default if unknown
    if (l.mileage != null) {
      if (l.mileage < 50000) mileageRisk = 2;
      else if (l.mileage < 100000) mileageRisk = 1.5;
      else if (l.mileage < 150000) mileageRisk = 1;
      else if (l.mileage < 200000) mileageRisk = 0.5;
      else mileageRisk = 0;
    }

    // 3. Age / maintainability (0-2): newer = better
    let age = 1;
    if (l.year) {
      const carAge = currentYear - l.year;
      if (carAge <= 2) age = 2;
      else if (carAge <= 5) age = 1.5;
      else if (carAge <= 8) age = 1;
      else if (carAge <= 12) age = 0.5;
      else age = 0;
    }

    // 4. Completeness / trust (0-1.5): more info = more trustworthy
    let completeness = 0;
    if (l.imageUrl) completeness += 0.5;
    if (l.phone) completeness += 0.5;
    if (l.mileage != null && l.year && l.fuelType) completeness += 0.5;

    // 5. Seller trust (0-1.5): pro dealers slightly more trustworthy
    let sellerTrust = 0.75;
    if (l.sellerType) {
      const st = l.sellerType.toLowerCase();
      if (st.includes("pro") || st.includes("concessionnaire")) sellerTrust = 1.5;
      else if (st.includes("particulier")) sellerTrust = 0.75;
    }

    const rawScore = priceValue + mileageRisk + age + completeness + sellerTrust;
    // Clamp to 0-10
    const dealScore = Math.min(10, Math.max(0, Math.round(rawScore * 10) / 10));

    return {
      ...l,
      dealScore,
      dealScoreDetails: {
        priceValue: Math.round(priceValue * 10) / 10,
        mileageRisk: Math.round(mileageRisk * 10) / 10,
        age: Math.round(age * 10) / 10,
        completeness: Math.round(completeness * 10) / 10,
        sellerTrust: Math.round(sellerTrust * 10) / 10,
      },
    };
  });
}

export function getSimilarListings(listing: Listing, allListings: Listing[], limit = 4): Listing[] {
  return allListings
    .filter((l) => {
      if (l.id === listing.id) return false;
      if (l.brand.toLowerCase() !== listing.brand.toLowerCase()) return false;
      return true;
    })
    .sort((a, b) => {
      // Prefer same year range, then same fuel, then has image
      let scoreA = 0;
      let scoreB = 0;
      if (listing.year && a.year && Math.abs(a.year - listing.year) <= 3) scoreA += 2;
      if (listing.year && b.year && Math.abs(b.year - listing.year) <= 3) scoreB += 2;
      if (listing.fuelType && a.fuelType === listing.fuelType) scoreA += 1;
      if (listing.fuelType && b.fuelType === listing.fuelType) scoreB += 1;
      if (a.imageUrl) scoreA += 1;
      if (b.imageUrl) scoreB += 1;
      if (a.price) scoreA += 1;
      if (b.price) scoreB += 1;
      return scoreB - scoreA;
    })
    .slice(0, limit);
}

const rawListings: Listing[] = (listingsJson as Listing[]).filter(
  (l) => l.imageUrl && l.imageUrl.trim() !== ""
);
const withPricesEstimated: Listing[] = estimatePrices(rawListings);
const listings: Listing[] = computeDealScores(withPricesEstimated);

export function getAllListings(): Listing[] {
  return listings;
}

export function getListingById(id: string): Listing | undefined {
  return listings.find((l) => l.id === id);
}

export function getUniqueBrands(listings: Listing[]): string[] {
  const brands = new Set(listings.map((l) => l.brand).filter(Boolean));
  return Array.from(brands).sort();
}

export function getUniqueCities(listings: Listing[]): string[] {
  const cities = new Set(listings.map((l) => l.city).filter(Boolean) as string[]);
  return Array.from(cities).sort();
}

export function getUniqueFuelTypes(listings: Listing[]): string[] {
  const fuels = new Set(listings.map((l) => l.fuelType).filter(Boolean) as string[]);
  return Array.from(fuels).sort();
}
