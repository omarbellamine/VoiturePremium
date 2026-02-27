"use client";

import { useState } from "react";
import { Filters, SORT_OPTIONS } from "@/lib/types";

interface FilterBarProps {
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: string) => void;
  onReset: () => void;
  activeCount: number;
  brands: string[];
  cities: string[];
  fuelTypes: string[];
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.15em]">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-surface-light/80 border border-white/[0.05] rounded-xl px-3.5 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-gold/30 transition-all duration-300 appearance-none cursor-pointer hover:border-white/[0.1] focus-gold"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.15em]">
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-surface-light/80 border border-white/[0.05] rounded-xl px-3.5 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-gold/30 transition-all duration-300 placeholder-zinc-700 hover:border-white/[0.1] focus-gold"
      />
    </div>
  );
}

export default function FilterBar({
  filters,
  onFilterChange,
  onReset,
  activeCount,
  brands,
  cities,
  fuelTypes,
}: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-3">
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden w-full flex items-center justify-between glass rounded-2xl px-5 py-3.5 text-sm text-zinc-300"
      >
        <div className="flex items-center gap-2.5">
          <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="font-medium">Filtres avancés</span>
          {activeCount > 0 && (
            <span className="bg-gold/20 text-gold text-[10px] font-bold px-2 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-zinc-500 transition-transform duration-300 ease-out-expo ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Filter fields */}
      <div
        className={`glass rounded-2xl p-6 transition-all duration-300 ${
          isOpen ? "block" : "hidden md:block"
        }`}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-5">
          <SelectField
            label="Marque"
            value={filters.brand}
            onChange={(v) => onFilterChange("brand", v)}
            options={[
              { value: "", label: "Toutes" },
              ...brands.map((b) => ({ value: b, label: b })),
            ]}
          />
          <SelectField
            label="Ville"
            value={filters.city}
            onChange={(v) => onFilterChange("city", v)}
            options={[
              { value: "", label: "Toutes" },
              ...cities.map((c) => ({ value: c, label: c })),
            ]}
          />
          <SelectField
            label="Carburant"
            value={filters.fuelType}
            onChange={(v) => onFilterChange("fuelType", v)}
            options={[
              { value: "", label: "Tous" },
              ...fuelTypes.map((f) => ({ value: f, label: f })),
            ]}
          />
          <InputField
            label="Prix min"
            value={filters.priceMin}
            onChange={(v) => onFilterChange("priceMin", v)}
            placeholder="0 MAD"
          />
          <InputField
            label="Prix max"
            value={filters.priceMax}
            onChange={(v) => onFilterChange("priceMax", v)}
            placeholder="Illimité"
          />
          <SelectField
            label="Trier par"
            value={filters.sortBy}
            onChange={(v) => onFilterChange("sortBy", v)}
            options={SORT_OPTIONS}
          />
          <div className="flex items-end">
            {activeCount > 0 ? (
              <button
                onClick={onReset}
                className="w-full px-3.5 py-2.5 text-sm font-semibold text-gold border border-gold/25 rounded-xl hover:bg-gold hover:text-black transition-all duration-300 hover:shadow-gold-md"
              >
                Effacer ({activeCount})
              </button>
            ) : (
              <div className="w-full h-[42px]" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
