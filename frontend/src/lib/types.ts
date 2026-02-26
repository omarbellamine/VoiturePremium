export interface Listing {
  id: string;
  source: string;
  url: string;
  title: string;
  brand: string;
  model: string | null;
  price: number | null;
  year: number | null;
  mileage: number | null;
  fuelType: string | null;
  transmission: string | null;
  city: string | null;
  phone: string | null;
  imageUrl: string | null;
  sellerType: string | null;
  postedAt: string | null;
  scrapedAt: string | null;
  estimatedPrice?: number;
  dealScore?: number;
  dealScoreDetails?: {
    priceValue: number;
    mileageRisk: number;
    age: number;
    completeness: number;
    sellerTrust: number;
  };
}

export interface Filters {
  brand: string;
  city: string;
  fuelType: string;
  yearMin: string;
  yearMax: string;
  priceMin: string;
  priceMax: string;
  sortBy: string;
  search: string;
}

export const SORT_OPTIONS = [
  { value: "date_desc", label: "Plus récentes" },
  { value: "date_asc", label: "Plus anciennes" },
  { value: "price_asc", label: "Prix croissant" },
  { value: "price_desc", label: "Prix décroissant" },
  { value: "year_desc", label: "Année décroissante" },
  { value: "year_asc", label: "Année croissante" },
  { value: "mileage_asc", label: "Kilométrage croissant" },
];

export const DEFAULT_FILTERS: Filters = {
  brand: "",
  city: "",
  fuelType: "",
  yearMin: "",
  yearMax: "",
  priceMin: "",
  priceMax: "",
  sortBy: "date_desc",
  search: "",
};
