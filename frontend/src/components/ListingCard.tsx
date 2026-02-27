import Link from "next/link";
import { Listing } from "@/lib/types";

interface ListingCardProps {
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

const SOURCE_STYLES: Record<string, { bg: string; dot: string; label: string }> = {
  avito: { bg: "bg-blue-500/10 text-blue-400 border-blue-500/15", dot: "bg-blue-400", label: "Avito" },
  wandaloo: { bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/15", dot: "bg-emerald-400", label: "Wandaloo" },
  moteur: { bg: "bg-violet-500/10 text-violet-400 border-violet-500/15", dot: "bg-violet-400", label: "Moteur" },
};

export default function ListingCard({ listing }: ListingCardProps) {
  const source = SOURCE_STYLES[listing.source] || { bg: "bg-zinc-800/50 text-zinc-400 border-zinc-700/50", dot: "bg-zinc-400", label: listing.source };

  return (
    <Link
      href={`/listing/${listing.id}`}
      className="card-stagger group relative bg-surface-light rounded-2xl overflow-hidden border border-white/[0.04] hover:border-gold/15 transition-all duration-500 ease-out-expo shadow-card hover:shadow-card-hover hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] bg-surface overflow-hidden">
        {listing.imageUrl ? (
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-[800ms] ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface">
            <svg className="w-10 h-10 text-zinc-800/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Bottom gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface-light via-surface-light/60 to-transparent" />

        {/* Source badge */}
        <div className={`absolute top-3 left-3 flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full border backdrop-blur-md ${source.bg}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${source.dot}`} />
          {source.label}
        </div>

        {/* Deal score badge */}
        {listing.dealScore != null && (
          <div className={`absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-md border ${
            listing.dealScore >= 7 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
            listing.dealScore >= 5 ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
            "bg-red-500/10 text-red-400 border-red-500/20"
          }`}>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {listing.dealScore.toFixed(1)}
          </div>
        )}

        {/* Price overlay */}
        {listing.price ? (
          <div className="absolute bottom-3 left-3">
            <span className="text-base font-bold text-white drop-shadow-lg">
              {formatPrice(listing.price)}
            </span>
          </div>
        ) : listing.estimatedPrice ? (
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <span className="text-sm font-semibold text-amber-200/80 drop-shadow-lg">
              ~{formatPrice(listing.estimatedPrice)}
            </span>
            <span className="badge-shine text-[8px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/25 px-1.5 py-0.5 rounded-md backdrop-blur-sm">
              Estimé
            </span>
          </div>
        ) : null}
      </div>

      {/* Content */}
      <div className="p-5 space-y-3.5">
        <div>
          <p className="text-[10px] font-bold text-gold/80 uppercase tracking-[0.15em] mb-1.5">
            {listing.brand}
          </p>
          <h3 className="text-[13px] font-semibold text-zinc-200 leading-snug line-clamp-2 group-hover:text-white transition-colors duration-300">
            {listing.title}
          </h3>
        </div>

        {!listing.price && !listing.estimatedPrice && (
          <p className="text-sm font-semibold text-zinc-500">
            Prix sur demande
          </p>
        )}

        {/* Specs chips */}
        <div className="flex flex-wrap gap-1.5">
          {listing.year && (
            <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400 bg-white/[0.03] px-2 py-1 rounded-lg">
              <svg className="w-3 h-3 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {listing.year}
            </span>
          )}
          {listing.mileage && (
            <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400 bg-white/[0.03] px-2 py-1 rounded-lg">
              <svg className="w-3 h-3 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {formatMileage(listing.mileage)}
            </span>
          )}
          {listing.fuelType && (
            <span className="text-[11px] text-zinc-400 bg-white/[0.03] px-2 py-1 rounded-lg">
              {listing.fuelType}
            </span>
          )}
        </div>

        {/* City + Date */}
        {(listing.city || listing.postedAt || listing.scrapedAt) && (
          <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-2.5 border-t border-white/[0.04]">
            {listing.city && (
              <div className="flex items-center gap-1.5">
                <svg className="w-3 h-3 flex-shrink-0 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-zinc-400">{listing.city}</span>
              </div>
            )}
            {(listing.postedAt || listing.scrapedAt) && (
              <span className="text-zinc-600 text-[10px]">
                {new Date(listing.postedAt || listing.scrapedAt!).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom hover accent */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/0 to-transparent group-hover:via-gold/30 transition-all duration-500" />
    </Link>
  );
}
