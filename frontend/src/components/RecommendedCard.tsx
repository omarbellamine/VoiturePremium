import Link from "next/link";
import { Listing } from "@/lib/types";

interface RecommendedCardProps {
  listing: Listing;
}

function formatPrice(price: number | null): string {
  if (!price) return "Prix sur demande";
  return new Intl.NumberFormat("fr-MA").format(price) + " MAD";
}

function formatMileage(km: number | null): string {
  if (!km) return "";
  return new Intl.NumberFormat("fr-MA").format(km) + " km";
}

export default function RecommendedCard({ listing }: RecommendedCardProps) {
  return (
    <Link
      href={`/listing/${listing.id}`}
      className="group relative block bg-surface-light rounded-2xl overflow-hidden border border-gold/20 hover:border-gold/40 transition-all duration-300 shadow-card hover:shadow-card-hover"
    >
      {/* Gold badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-gold/90 backdrop-blur-sm text-black text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        Recommandé
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="relative md:w-2/5 aspect-[16/10] md:aspect-auto bg-surface overflow-hidden">
          {listing.imageUrl ? (
            <img
              src={listing.imageUrl}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full min-h-[200px] flex items-center justify-center bg-surface">
              <svg className="w-16 h-16 text-zinc-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-5 md:p-6 flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <div>
              <p className="text-[11px] font-medium text-gold uppercase tracking-wider mb-1.5">
                {listing.brand}
              </p>
              <h3 className="text-lg font-bold text-white leading-snug group-hover:text-gold-light transition-colors">
                {listing.title}
              </h3>
            </div>

            <p className="text-xl font-bold text-transparent bg-clip-text bg-gold-gradient">
              {formatPrice(listing.price)}
            </p>

            {/* Specs */}
            <div className="flex flex-wrap gap-2">
              {listing.year && (
                <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400 bg-white/[0.04] px-2.5 py-1 rounded-md">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {listing.year}
                </span>
              )}
              {listing.mileage && (
                <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400 bg-white/[0.04] px-2.5 py-1 rounded-md">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {formatMileage(listing.mileage)}
                </span>
              )}
              {listing.fuelType && (
                <span className="text-xs text-zinc-400 bg-white/[0.04] px-2.5 py-1 rounded-md">
                  {listing.fuelType}
                </span>
              )}
              {listing.transmission && (
                <span className="text-xs text-zinc-400 bg-white/[0.04] px-2.5 py-1 rounded-md">
                  {listing.transmission}
                </span>
              )}
              {listing.city && (
                <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400 bg-white/[0.04] px-2.5 py-1 rounded-md">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {listing.city}
                </span>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2 text-sm font-medium text-gold group-hover:text-gold-light transition-colors">
            Voir l&apos;annonce
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
