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
    <div className={`relative group transition-all duration-500 ${isFocused ? "scale-[1.02]" : ""}`}>
      {/* Outer glow */}
      <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-r from-gold/20 via-gold/5 to-gold/20 opacity-0 blur-lg transition-all duration-500 ${isFocused ? "opacity-100 -inset-2" : "group-hover:opacity-40"}`} />

      <div className="relative">
        <svg
          className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${isFocused ? "text-gold" : "text-zinc-600"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
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
          className="w-full pl-14 pr-14 py-5 glass rounded-2xl text-white placeholder-zinc-600 focus:outline-none transition-all duration-300 text-[15px] font-medium focus-gold"
        />
        {localValue && (
          <button
            onClick={() => {
              setLocalValue("");
              onChange("");
            }}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors duration-200 p-1 rounded-lg hover:bg-white/[0.04]"
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
