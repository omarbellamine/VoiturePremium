import Link from "next/link";
import { Listing } from "@/lib/types";

interface RecommendedCardProps {
  listing: Listing;
}

function formatPrice(price: number): string {
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
      className="group relative block bg-surface-light rounded-2xl overflow-hidden border border-gold/15 hover:border-gold/30 transition-all duration-300 shadow-card hover:shadow-card-hover"
    >
      {/* Gold accent line at top */}
      <div className="absolute top-0 inset-x-0 h-px bg-gold-gradient z-10" />

      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative sm:w-[340px] lg:w-[400px] flex-shrink-0 aspect-[16/10] sm:aspect-auto bg-surface overflow-hidden">
          {listing.imageUrl ? (
            <img
              src={listing.imageUrl}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full min-h-[220px] flex items-center justify-center bg-surface">
              <svg className="w-14 h-14 text-zinc-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Recommandé badge */}
          <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-1.5 bg-gold text-black text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Recommandé
          </div>

          {/* Deal score badge */}
          {listing.dealScore != null && (
            <div className={`absolute top-3.5 right-3.5 flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm border ${
              listing.dealScore >= 7 ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25" :
              listing.dealScore >= 5 ? "bg-amber-500/15 text-amber-400 border-amber-500/25" :
              "bg-red-500/15 text-red-400 border-red-500/25"
            }`}>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {listing.dealScore.toFixed(1)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-6 sm:p-7 flex flex-col justify-between gap-5">
          <div className="space-y-3">
            <p className="text-[11px] font-semibold text-gold uppercase tracking-wider">
              {listing.brand}
            </p>
            <h3 className="text-lg sm:text-xl font-bold text-white leading-snug group-hover:text-gold-light transition-colors">
              {listing.title}
            </h3>

            {/* Price */}
            <div>
              {listing.price ? (
                <p className="text-xl font-bold text-transparent bg-clip-text bg-gold-gradient">
                  {formatPrice(listing.price)}
                </p>
              ) : listing.estimatedPrice ? (
                <div className="flex items-center gap-2">
                  <p className="text-xl font-bold text-amber-200/70">
                    ~{formatPrice(listing.estimatedPrice)}
                  </p>
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded">
                    Estimé
                  </span>
                </div>
              ) : (
                <p className="text-xl font-bold text-zinc-500">Prix sur demande</p>
              )}
            </div>
          </div>

          {/* Specs row */}
          <div className="flex flex-wrap gap-2">
            {listing.year && (
              <span className="inline-flex items-center gap-1.5 text-xs text-zinc-300 bg-white/[0.05] px-3 py-1.5 rounded-lg">
                <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {listing.year}
              </span>
            )}
            {listing.mileage && (
              <span className="inline-flex items-center gap-1.5 text-xs text-zinc-300 bg-white/[0.05] px-3 py-1.5 rounded-lg">
                <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {formatMileage(listing.mileage)}
              </span>
            )}
            {listing.fuelType && (
              <span className="text-xs text-zinc-300 bg-white/[0.05] px-3 py-1.5 rounded-lg">
                {listing.fuelType}
              </span>
            )}
            {listing.transmission && (
              <span className="text-xs text-zinc-300 bg-white/[0.05] px-3 py-1.5 rounded-lg">
                {listing.transmission}
              </span>
            )}
            {listing.city && (
              <span className="inline-flex items-center gap-1.5 text-xs text-zinc-300 bg-white/[0.05] px-3 py-1.5 rounded-lg">
                <svg className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {listing.city}
              </span>
            )}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2 text-sm font-semibold text-gold group-hover:text-gold-light transition-colors">
            Voir l&apos;annonce
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
