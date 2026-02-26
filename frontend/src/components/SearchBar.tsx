"use client";

import { useEffect, useRef, useState } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setLocalValue(v);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onChange(v), 300);
  };

  return (
    <div className={`relative group transition-all duration-300 ${isFocused ? "scale-[1.01]" : ""}`}>
      <div className={`absolute -inset-0.5 rounded-xl bg-gradient-to-r from-gold/20 via-gold/10 to-gold/20 opacity-0 blur transition-opacity duration-300 ${isFocused ? "opacity-100" : "group-hover:opacity-50"}`} />
      <div className="relative">
        <svg
          className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${isFocused ? "text-gold" : "text-zinc-500"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={localValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Rechercher par marque, modèle, ville..."
          className="w-full pl-12 pr-12 py-4 bg-surface-light border border-white/[0.06] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-gold/40 transition-all text-[15px]"
        />
        {localValue && (
          <button
            onClick={() => {
              setLocalValue("");
              onChange("");
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors p-0.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
