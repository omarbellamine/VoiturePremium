"use client";

import { useState, useMemo, useCallback } from "react";
import { Listing, Filters, DEFAULT_FILTERS } from "@/lib/types";
import { applyFilters } from "@/lib/filters";

export function useFilters(listings: Listing[]) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const updateFilter = useCallback(
    (key: keyof Filters, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const filteredListings = useMemo(
    () => applyFilters(listings, filters),
    [listings, filters]
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.brand) count++;
    if (filters.city) count++;
    if (filters.fuelType) count++;
    if (filters.yearMin) count++;
    if (filters.yearMax) count++;
    if (filters.priceMin) count++;
    if (filters.priceMax) count++;
    if (filters.dealScoreMin) count++;
    if (filters.search) count++;
    return count;
  }, [filters]);

  return {
    filters,
    filteredListings,
    updateFilter,
    resetFilters,
    activeFilterCount,
  };
}
