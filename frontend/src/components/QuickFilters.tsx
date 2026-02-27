"use client";

import { Filters } from "@/lib/types";

interface QuickFiltersProps {
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: string) => void;
}

const BRAND_CHIPS = ["Mercedes-Benz", "BMW", "Audi", "Range Rover", "Porsche"];

const PRICE_CHIPS = [
  { label: "< 200K", min: "", max: "200000" },
  { label: "200-500K", min: "200000", max: "500000" },
  { label: "500K+", min: "500000", max: "" },
];

const FUEL_CHIPS = ["Diesel", "Essence"];

const DEAL_CHIPS = [
  { label: "Top Deals", min: "7", color: "emerald" as const },
  { label: "Bons Deals", min: "5", color: "amber" as const },
];

function Pill({
  active,
  onClick,
  children,
  variant = "default",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  variant?: "default" | "emerald" | "amber";
}) {
  const activeStyles = {
    default: "bg-gold text-black shadow-gold-sm",
    emerald: "bg-emerald-500 text-white shadow-sm",
    amber: "bg-amber-500 text-black shadow-sm",
  };

  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
        active
          ? `${activeStyles[variant]} scale-105`
          : "glass text-zinc-400 hover:text-zinc-200 hover:scale-[1.03]"
      }`}
    >
      <span className="relative">{children}</span>
    </button>
  );
}

function Divider() {
  return <span className="w-px h-5 bg-white/[0.06] self-center mx-0.5" />;
}

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

  const toggleDeal = (min: string) => {
    if (filters.dealScoreMin === min) {
      onFilterChange("dealScoreMin", "");
      // Reset sort if it was set to deal_desc
      if (filters.sortBy === "deal_desc") {
        onFilterChange("sortBy", "date_desc");
      }
    } else {
      onFilterChange("dealScoreMin", min);
      onFilterChange("sortBy", "deal_desc");
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {/* Deal score chips first — most prominent */}
      {DEAL_CHIPS.map((chip) => (
        <Pill
          key={chip.label}
          active={filters.dealScoreMin === chip.min}
          onClick={() => toggleDeal(chip.min)}
          variant={chip.color}
        >
          <span className="flex items-center gap-1.5">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {chip.label}
          </span>
        </Pill>
      ))}

      <Divider />

      {BRAND_CHIPS.map((brand) => (
        <Pill key={brand} active={filters.brand === brand} onClick={() => toggleBrand(brand)}>
          {brand}
        </Pill>
      ))}

      <Divider />

      {PRICE_CHIPS.map((chip) => (
        <Pill
          key={chip.label}
          active={filters.priceMin === chip.min && filters.priceMax === chip.max}
          onClick={() => togglePrice(chip.min, chip.max)}
        >
          {chip.label}
        </Pill>
      ))}

      <Divider />

      {FUEL_CHIPS.map((fuel) => (
        <Pill key={fuel} active={filters.fuelType === fuel} onClick={() => toggleFuel(fuel)}>
          {fuel}
        </Pill>
      ))}
    </div>
  );
}
