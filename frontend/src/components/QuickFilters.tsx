"use client";

import { Filters } from "@/lib/types";

interface QuickFiltersProps {
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: string) => void;
}

const BRAND_CHIPS = ["Mercedes-Benz", "BMW", "Audi", "Range Rover", "Porsche"];

const PRICE_CHIPS = [
  { label: "< 200K", min: "", max: "200000" },
  { label: "200K - 500K", min: "200000", max: "500000" },
  { label: "500K+", min: "500000", max: "" },
];

const FUEL_CHIPS = ["Diesel", "Essence"];

export default function QuickFilters({ filters, onFilterChange }: QuickFiltersProps) {
  const toggleBrand = (brand: string) => {
    onFilterChange("brand", filters.brand === brand ? "" : brand);
  };

  const togglePrice = (min: string, max: string) => {
    if (filters.priceMin === min && filters.priceMax === max) {
      onFilterChange("priceMin", "");
      onFilterChange("priceMax", "");
    } else {
      onFilterChange("priceMin", min);
      onFilterChange("priceMax", max);
    }
  };

  const toggleFuel = (fuel: string) => {
    onFilterChange("fuelType", filters.fuelType === fuel ? "" : fuel);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {BRAND_CHIPS.map((brand) => (
        <button
          key={brand}
          onClick={() => toggleBrand(brand)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
            filters.brand === brand
              ? "bg-gold text-black shadow-sm"
              : "bg-white/[0.04] text-zinc-400 border border-white/[0.08] hover:border-gold/30 hover:text-zinc-200"
          }`}
        >
          {brand}
        </button>
      ))}

      <span className="w-px h-6 bg-white/[0.06] self-center mx-1" />

      {PRICE_CHIPS.map((chip) => (
        <button
          key={chip.label}
          onClick={() => togglePrice(chip.min, chip.max)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
            filters.priceMin === chip.min && filters.priceMax === chip.max
              ? "bg-gold text-black shadow-sm"
              : "bg-white/[0.04] text-zinc-400 border border-white/[0.08] hover:border-gold/30 hover:text-zinc-200"
          }`}
        >
          {chip.label}
        </button>
      ))}

      <span className="w-px h-6 bg-white/[0.06] self-center mx-1" />

      {FUEL_CHIPS.map((fuel) => (
        <button
          key={fuel}
          onClick={() => toggleFuel(fuel)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
            filters.fuelType === fuel
              ? "bg-gold text-black shadow-sm"
              : "bg-white/[0.04] text-zinc-400 border border-white/[0.08] hover:border-gold/30 hover:text-zinc-200"
          }`}
        >
          {fuel}
        </button>
      ))}
    </div>
  );
}
