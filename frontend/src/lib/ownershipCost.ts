import { Listing } from "./types";

export interface CostItem {
  label: string;
  annual: number;
  icon: string;
}

export interface TimelineEvent {
  km: string;
  label: string;
  cost: string;
  severity: "low" | "medium" | "high";
}

export interface OwnershipData {
  annualCosts: CostItem[];
  totalAnnual: number;
  totalMonthly: number;
  timeline: TimelineEvent[];
  fuelCostPer100km: number;
}

// Brand tiers for maintenance costs (MAD/year)
const BRAND_MAINTENANCE: Record<string, { base: number; tier: string }> = {
  "mercedes-benz": { base: 8000, tier: "Premium" },
  "bmw": { base: 7500, tier: "Premium" },
  "audi": { base: 7000, tier: "Premium" },
  "range rover": { base: 12000, tier: "Ultra-Premium" },
  "land rover": { base: 10000, tier: "Ultra-Premium" },
  "porsche": { base: 11000, tier: "Ultra-Premium" },
  "volvo": { base: 5500, tier: "Premium" },
  "jaguar": { base: 9000, tier: "Premium" },
  "lexus": { base: 4500, tier: "Accessible" },
  "ferrari": { base: 25000, tier: "Supercar" },
  "bentley": { base: 20000, tier: "Ultra-Luxe" },
  "mini": { base: 5000, tier: "Accessible" },
  "ds": { base: 4000, tier: "Accessible" },
  "alfa romeo": { base: 6000, tier: "Premium" },
  "tesla": { base: 3000, tier: "Electric" },
};

// Fuel costs per 100km in MAD (Morocco prices ~13 MAD/L diesel, ~15 MAD/L essence)
const FUEL_CONSUMPTION: Record<string, { l100km: number; pricePerL: number }> = {
  diesel: { l100km: 7.5, pricePerL: 13 },
  essence: { l100km: 9.5, pricePerL: 15 },
  hybride: { l100km: 5.5, pricePerL: 15 },
  electrique: { l100km: 18, pricePerL: 1.5 }, // 18 kWh/100km at ~1.5 MAD/kWh
  électrique: { l100km: 18, pricePerL: 1.5 },
};

// Insurance brackets based on vehicle value (MAD/year)
function estimateInsurance(price: number | null, estimatedPrice?: number): number {
  const value = price || estimatedPrice || 300000;
  if (value > 1000000) return 12000;
  if (value > 500000) return 8000;
  if (value > 300000) return 6000;
  if (value > 150000) return 4500;
  return 3500;
}

// Age-based maintenance multiplier
function ageMultiplier(year: number | null): number {
  if (!year) return 1.2;
  const age = new Date().getFullYear() - year;
  if (age <= 2) return 0.6;
  if (age <= 4) return 0.8;
  if (age <= 6) return 1.0;
  if (age <= 8) return 1.3;
  if (age <= 12) return 1.6;
  return 2.0;
}

function buildTimeline(brand: string, year: number | null, fuelType: string | null, mileage: number | null): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  const brandKey = brand.toLowerCase();
  const currentKm = mileage || 0;
  const isDiesel = (fuelType || "").toLowerCase() === "diesel";
  const isLuxury = ["range rover", "land rover", "bentley", "ferrari", "porsche"].includes(brandKey);
  const baseCost = BRAND_MAINTENANCE[brandKey]?.base || 6000;

  // Standard service intervals
  const intervals: TimelineEvent[] = [
    { km: "10 000 km", label: "Vidange huile + filtres", cost: `${Math.round(baseCost * 0.15)} MAD`, severity: "low" },
    { km: "20 000 km", label: "Vidange + plaquettes frein (vérification)", cost: `${Math.round(baseCost * 0.2)} MAD`, severity: "low" },
    { km: "30 000 km", label: "Révision intermédiaire (filtres, bougies)", cost: `${Math.round(baseCost * 0.3)} MAD`, severity: "low" },
    { km: "60 000 km", label: "Grande révision (courroie accessoire, liquides)", cost: `${Math.round(baseCost * 0.6)} MAD`, severity: "medium" },
    { km: "80 000 km", label: "Plaquettes + disques frein", cost: `${Math.round(baseCost * 0.5)} MAD`, severity: "medium" },
    { km: "100 000 km", label: "Révision majeure (distribution, embrayage à vérifier)", cost: `${Math.round(baseCost * 1.2)} MAD`, severity: "high" },
    { km: "120 000 km", label: "Amortisseurs + silent blocs", cost: `${Math.round(baseCost * 0.8)} MAD`, severity: "medium" },
    { km: "150 000 km", label: "Embrayage / boîte (si manuelle ou DSG)", cost: `${Math.round(baseCost * 1.5)} MAD`, severity: "high" },
    { km: "200 000 km", label: "Révision lourde (moteur, turbo, injection)", cost: `${Math.round(baseCost * 2.0)} MAD`, severity: "high" },
  ];

  // Diesel-specific
  if (isDiesel) {
    intervals.push(
      { km: "80 000 km", label: "Nettoyage / remplacement FAP", cost: `${Math.round(baseCost * 0.7)} MAD`, severity: "medium" },
      { km: "120 000 km", label: "Injecteurs diesel (vérification/remplacement)", cost: `${Math.round(baseCost * 1.0)} MAD`, severity: "high" },
    );
  }

  // Luxury-specific
  if (isLuxury) {
    intervals.push(
      { km: "60 000 km", label: "Suspension pneumatique (diagnostic)", cost: `${Math.round(baseCost * 0.4)} MAD`, severity: "medium" },
      { km: "100 000 km", label: "Suspension pneumatique (remplacement possible)", cost: `${Math.round(baseCost * 2.5)} MAD`, severity: "high" },
    );
  }

  // BMW-specific
  if (brandKey === "bmw") {
    intervals.push(
      { km: "80 000 km", label: "Chaîne de distribution (vérification)", cost: `${Math.round(baseCost * 0.3)} MAD`, severity: "medium" },
    );
  }

  // Sort by km and filter to show relevant upcoming events
  const sorted = intervals
    .map((e) => ({ ...e, kmNum: parseInt(e.km.replace(/\s/g, "")) }))
    .sort((a, b) => a.kmNum - b.kmNum);

  // Show events: some past (context) and upcoming
  for (const event of sorted) {
    if (event.kmNum >= currentKm - 20000) {
      events.push({
        km: event.km,
        label: event.label,
        cost: event.cost,
        severity: event.severity,
      });
    }
  }

  return events.slice(0, 8);
}

export function computeOwnershipCost(listing: Listing): OwnershipData {
  const brandKey = listing.brand.toLowerCase();
  const brandData = BRAND_MAINTENANCE[brandKey] || { base: 6000, tier: "Standard" };

  // Maintenance (adjusted for age)
  const maintenanceBase = Math.round(brandData.base * ageMultiplier(listing.year));

  // Fuel cost (assuming 15,000 km/year)
  const fuelKey = (listing.fuelType || "essence").toLowerCase();
  const fuelData = FUEL_CONSUMPTION[fuelKey] || FUEL_CONSUMPTION["essence"];
  const annualFuel = Math.round((15000 / 100) * fuelData.l100km * fuelData.pricePerL);
  const fuelCostPer100km = Math.round(fuelData.l100km * fuelData.pricePerL);

  // Insurance
  const insurance = estimateInsurance(listing.price, listing.estimatedPrice);

  // Vignette (road tax) — rough estimate based on power
  const vignette = listing.price && listing.price > 500000 ? 5000 : 2500;

  const annualCosts: CostItem[] = [
    { label: "Entretien & Réparations", annual: maintenanceBase, icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
    { label: "Carburant (15 000 km/an)", annual: annualFuel, icon: "M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" },
    { label: "Assurance", annual: insurance, icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
    { label: "Vignette", annual: vignette, icon: "M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" },
  ];

  const totalAnnual = annualCosts.reduce((sum, c) => sum + c.annual, 0);
  const totalMonthly = Math.round(totalAnnual / 12);

  const timeline = buildTimeline(listing.brand, listing.year, listing.fuelType, listing.mileage);

  return {
    annualCosts,
    totalAnnual,
    totalMonthly,
    timeline,
    fuelCostPer100km,
  };
}
