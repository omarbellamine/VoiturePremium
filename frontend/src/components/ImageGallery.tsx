"use client";

import { useState } from "react";

interface ImageGalleryProps {
  images: string[];
  alt: string;
  source: string;
}

const SOURCE_LABELS: Record<string, string> = {
  avito: "Avito.ma",
  wandaloo: "Wandaloo.com",
  moteur: "Moteur.ma",
};

export default function ImageGallery({ images, alt, source }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultiple = images.length > 1;

  const goTo = (index: number) => {
    setActiveIndex(index);
  };

  const goPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-[16/10] bg-surface rounded-2xl overflow-hidden border border-white/[0.04] group">
        <img
          src={images[activeIndex]}
          alt={`${alt} - photo ${activeIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
        />

        {/* Source badge */}
        <span className="absolute top-4 left-4 text-[11px] font-medium px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white border border-white/10">
          {SOURCE_LABELS[source] || source}
        </span>

        {/* Photo counter */}
        {hasMultiple && (
          <span className="absolute top-4 right-4 text-[11px] font-medium px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white border border-white/10">
            {activeIndex + 1} / {images.length}
          </span>
        )}

        {/* Navigation arrows */}
        {hasMultiple && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/60"
              aria-label="Photo précédente"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/60"
              aria-label="Photo suivante"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {hasMultiple && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                i === activeIndex
                  ? "border-gold/70 ring-1 ring-gold/30"
                  : "border-white/[0.06] hover:border-white/20 opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={img}
                alt={`${alt} - miniature ${i + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
