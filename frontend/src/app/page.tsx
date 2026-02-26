"use client";

import { getAllListings, getUniqueBrands, getUniqueCities, getUniqueFuelTypes, getRecommendedListing } from "@/lib/data";
import { useFilters } from "@/hooks/useFilters";
import SearchBar from "@/components/SearchBar";
import FilterBar from "@/components/FilterBar";
import QuickFilters from "@/components/QuickFilters";
import RecommendedCard from "@/components/RecommendedCard";
import ListingGrid from "@/components/ListingGrid";

export default function HomePage() {
  const allListings = getAllListings();
  const { filters, filteredListings, updateFilter, resetFilters, activeFilterCount } =
    useFilters(allListings);

  const brands = getUniqueBrands(allListings);
  const cities = getUniqueCities(allListings);
  const fuelTypes = getUniqueFuelTypes(allListings);

  const recommended = getRecommendedListing(allListings);
  const hasActiveFilters = activeFilterCount > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* Hero */}
      <div className="text-center pt-16 pb-10 space-y-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Voitures{" "}
          <span className="text-transparent bg-clip-text bg-gold-gradient">Premium</span>{" "}
          au Maroc
        </h2>
        <p className="text-sm text-zinc-500">
          {allListings.length} annonces de voitures de luxe
        </p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto mb-8">
        <SearchBar
          value={filters.search}
          onChange={(v) => updateFilter("search", v)}
        />
      </div>

      {/* Quick Filters */}
      <div className="flex justify-center mb-6">
        <QuickFilters filters={filters} onFilterChange={updateFilter} />
      </div>

      {/* Filters */}
      <div className="mb-6">
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

      {/* Recommended */}
      {recommended && !hasActiveFilters && (
        <div className="mb-8">
          <RecommendedCard listing={recommended} />
        </div>
      )}

      {/* Results count */}
      <p className="text-sm text-zinc-500 mb-5">
        {filteredListings.length} résultat{filteredListings.length !== 1 ? "s" : ""}
      </p>

      {/* Grid */}
      <ListingGrid listings={filteredListings} />

      {/* Bottom spacer */}
      <div className="h-12" />
    </div>
  );
}
