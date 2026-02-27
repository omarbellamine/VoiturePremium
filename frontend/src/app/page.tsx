"use client";

import { getAllListings, getUniqueBrands, getUniqueCities, getUniqueFuelTypes } from "@/lib/data";
import { useFilters } from "@/hooks/useFilters";
import SearchBar from "@/components/SearchBar";
import FilterBar from "@/components/FilterBar";
import QuickFilters from "@/components/QuickFilters";
import ListingGrid from "@/components/ListingGrid";

export default function HomePage() {
  const allListings = getAllListings();
  const { filters, filteredListings, updateFilter, resetFilters, activeFilterCount } =
    useFilters(allListings);

  const brands = getUniqueBrands(allListings);
  const cities = getUniqueCities(allListings);
  const fuelTypes = getUniqueFuelTypes(allListings);

  const withPrices = allListings.filter((l) => l.price && l.price > 0);
  const avgPrice = withPrices.length > 0
    ? Math.round(withPrices.reduce((s, l) => s + l.price!, 0) / withPrices.length)
    : 0;

  return (
    <div className="relative">
      {/* Hero background glow */}
      <div className="absolute inset-x-0 top-0 h-[600px] bg-hero-glow pointer-events-none" />
      <div className="absolute inset-x-0 top-20 h-[400px] bg-hero-glow-2 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        {/* Hero */}
        <div className="text-center pt-24 pb-14">
          <div className="animate-fade-in">
            <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-gold/60 mb-5">
              Agrégateur automobile premium
            </p>
          </div>

          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] animate-slide-up">
            Trouvez votre{" "}
            <span className="text-gradient-animated">voiture de luxe</span>
          </h2>

          <p className="mt-5 text-base sm:text-lg text-zinc-500 max-w-xl mx-auto leading-relaxed animate-slide-up-delayed">
            {allListings.length} annonces vérifiées de véhicules premium au Maroc
          </p>

          {/* Stats pills */}
          <div className="flex items-center justify-center gap-3 sm:gap-5 mt-8 animate-slide-up-delayed">
            <div className="glass rounded-full px-4 py-2 flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-glow-pulse" />
              <span className="text-xs font-semibold text-zinc-300">{allListings.length}</span>
              <span className="text-[11px] text-zinc-500">annonces</span>
            </div>
            <div className="glass rounded-full px-4 py-2 flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold/70" />
              <span className="text-xs font-semibold text-zinc-300">{brands.length}</span>
              <span className="text-[11px] text-zinc-500">marques</span>
            </div>
            {avgPrice > 0 && (
              <div className="hidden sm:flex glass rounded-full px-4 py-2 items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400/70" />
                <span className="text-xs font-semibold text-zinc-300">
                  {new Intl.NumberFormat("fr-MA").format(avgPrice)}
                </span>
                <span className="text-[11px] text-zinc-500">MAD moy.</span>
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-10 animate-scale-in">
          <SearchBar
            value={filters.search}
            onChange={(v) => updateFilter("search", v)}
          />
        </div>

        {/* Quick Filters */}
        <div className="flex justify-center mb-8">
          <QuickFilters filters={filters} onFilterChange={updateFilter} />
        </div>

        {/* Filters */}
        <div className="mb-10">
          <FilterBar
            filters={filters}
            onFilterChange={updateFilter}
            onReset={resetFilters}
            activeCount={activeFilterCount}
            brands={brands}
            cities={cities}
            fuelTypes={fuelTypes}
          />
        </div>

        {/* Divider + results count */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-white/[0.04]" />
          <p className="text-xs font-medium text-zinc-500 tracking-wide">
            {filteredListings.length} résultat{filteredListings.length !== 1 ? "s" : ""}
          </p>
          <div className="h-px flex-1 bg-white/[0.04]" />
        </div>

        {/* Grid */}
        <ListingGrid listings={filteredListings} />

        {/* Bottom spacer */}
        <div className="h-20" />
      </div>
    </div>
  );
}
