import { getAllListings, getListingById, getSimilarListings } from "@/lib/data";
import ContactInfo from "@/components/ContactInfo";
import DealScore from "@/components/DealScore";
import VehicleInsights from "@/components/VehicleInsights";
import OwnershipCost from "@/components/OwnershipCost";
import ModelHistory from "@/components/ModelHistory";
import Link from "next/link";

function formatPrice(price: number | null): string {
  if (!price) return "Prix sur demande";
  return new Intl.NumberFormat("fr-MA").format(price) + " MAD";
}

function formatMileage(km: number | null): string {
  if (!km) return "\u2014";
  return new Intl.NumberFormat("fr-MA").format(km) + " km";
}

const SOURCE_LABELS: Record<string, string> = {
  avito: "Avito.ma",
  wandaloo: "Wandaloo.com",
  moteur: "Moteur.ma",
};

export async function generateStaticParams() {
  const listings = getAllListings();
  return listings.map((l) => ({ id: l.id }));
}

export default function ListingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const allListings = getAllListings();
  const listing = getListingById(params.id);

  if (!listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-surface-lighter flex items-center justify-center">
          <svg className="w-8 h-8 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Annonce non trouvée</h2>
        <p className="text-sm text-zinc-500 mb-6">Cette annonce n&apos;existe plus ou a été supprimée</p>
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold-light transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour aux annonces
        </Link>
      </div>
    );
  }

  const similarListings = getSimilarListings(listing, allListings);

  const specs = [
    { label: "Marque", value: listing.brand, icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
    { label: "Modèle", value: listing.model || null, icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
    { label: "Année", value: listing.year?.toString() || null, icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { label: "Kilométrage", value: listing.mileage ? formatMileage(listing.mileage) : null, icon: "M13 10V3L4 14h7v7l9-11h-7z" },
    { label: "Carburant", value: listing.fuelType || null, icon: "M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" },
    { label: "Transmission", value: listing.transmission || null, icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
    { label: "Ville", value: listing.city || null, icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" },
    { label: "Vendeur", value: listing.sellerType || null, icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  ].filter((spec) => spec.value !== null) as { label: string; value: string; icon: string }[];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
        <Link href="/" className="hover:text-gold transition-colors flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Annonces
        </Link>
        <span className="text-zinc-700">/</span>
        <span className="text-gold">{listing.brand}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10">
        {/* Left: Image + title + specs (3 cols) */}
        <div className="lg:col-span-3 space-y-8">
          {/* Image */}
          <div className="relative aspect-[16/10] bg-surface rounded-2xl overflow-hidden border border-white/[0.04]">
            {listing.imageUrl ? (
              <img
                src={listing.imageUrl}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-20 h-20 text-zinc-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            {/* Source badge */}
            <span className="absolute top-4 left-4 text-[11px] font-medium px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white border border-white/10">
              {SOURCE_LABELS[listing.source] || listing.source}
            </span>
          </div>

          {/* Title + price */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              {listing.title}
            </h1>
            <div>
              {listing.price ? (
                <p className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gold-gradient">
                  {formatPrice(listing.price)}
                </p>
              ) : listing.estimatedPrice ? (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="text-2xl sm:text-3xl font-bold text-amber-200/70">
                      ~{new Intl.NumberFormat("fr-MA").format(listing.estimatedPrice)} MAD
                    </p>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/25 px-2.5 py-1 rounded-full">
                      Prix estimé
                    </span>
                  </div>
                  <div className="flex items-start gap-2 bg-amber-500/[0.06] border border-amber-500/15 rounded-xl px-4 py-3">
                    <svg className="w-4 h-4 text-amber-500/70 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Ce prix est une <span className="text-amber-400 font-medium">estimation</span> calculée à partir de véhicules similaires (même marque, année et motorisation). Le prix réel peut varier.
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-2xl sm:text-3xl font-bold text-zinc-500">Prix sur demande</p>
              )}
            </div>
          </div>

          {/* Specs grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {specs.map((spec) => (
              <div
                key={spec.label}
                className="bg-surface-light border border-white/[0.04] rounded-xl p-4 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-gold/60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {spec.icon.split(" M").map((d, i) => (
                      <path key={i} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={i === 0 ? d : `M${d}`} />
                    ))}
                  </svg>
                  <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                    {spec.label}
                  </p>
                </div>
                <p className="text-sm font-medium text-zinc-200 truncate">
                  {spec.value}
                </p>
              </div>
            ))}
          </div>

          {/* Seller description */}
          {listing.description && (
            <div className="bg-surface-light border border-white/[0.04] rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-gold/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <h3 className="text-sm font-semibold text-white">Description du vendeur</h3>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </div>
          )}
        </div>

        {/* Right: Contact sidebar + Deal Score (2 cols) */}
        <div className="lg:col-span-2">
          <div className="sticky top-20 space-y-5">
            {/* Deal Score */}
            <DealScore listing={listing} />

            {/* Contact card */}
            <div className="bg-surface-light border border-white/[0.04] rounded-2xl p-6 space-y-5">
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-white">Contacter le vendeur</h3>
                {listing.sellerType && (
                  <p className="text-xs text-zinc-500">{listing.sellerType}</p>
                )}
              </div>

              <ContactInfo
                phone={listing.phone}
                url={listing.url}
                source={listing.source}
              />

              <div className="text-[11px] text-zinc-600 text-center pt-3 border-t border-white/[0.04] space-y-1">
                {listing.postedAt && (
                  <p>
                    Publié le : <span className="text-zinc-400">{new Date(listing.postedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
                  </p>
                )}
                {listing.scrapedAt && (
                  <p>
                    Dernière vérification : {new Date(listing.scrapedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                )}
              </div>
            </div>

            {/* Back link */}
            <Link
              href="/"
              className="flex items-center justify-center gap-2 text-sm text-zinc-500 hover:text-gold transition-colors py-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour aux annonces
            </Link>
          </div>
        </div>
      </div>

      {/* Cost of Ownership */}
      <div className="mt-14 pt-10 border-t border-white/[0.04]">
        <OwnershipCost listing={listing} />
      </div>

      {/* Vehicle Insights — Pros & Cons */}
      <div className="mt-14 pt-10 border-t border-white/[0.04]">
        <VehicleInsights listing={listing} />
      </div>

      {/* Brand History */}
      <div className="mt-14 pt-10 border-t border-white/[0.04]">
        <ModelHistory brand={listing.brand} />
      </div>

      {/* Similar listings */}
      {similarListings.length > 0 && (
        <div className="mt-16 pt-10 border-t border-white/[0.04]">
          <h2 className="text-xl font-bold text-white mb-6">
            Annonces similaires
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {similarListings.map((sl) => (
              <Link
                key={sl.id}
                href={`/listing/${sl.id}`}
                className="group bg-surface-light rounded-2xl overflow-hidden border border-white/[0.04] hover:border-gold/20 transition-all duration-300 shadow-card hover:shadow-card-hover hover:-translate-y-0.5"
              >
                <div className="relative aspect-[16/10] bg-surface overflow-hidden">
                  {sl.imageUrl ? (
                    <img
                      src={sl.imageUrl}
                      alt={sl.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-surface">
                      <svg className="w-10 h-10 text-zinc-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {/* Score badge */}
                  {sl.dealScore != null && (
                    <div className={`absolute top-2.5 right-2.5 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm border ${
                      sl.dealScore >= 7 ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25" :
                      sl.dealScore >= 5 ? "bg-amber-500/15 text-amber-400 border-amber-500/25" :
                      "bg-red-500/15 text-red-400 border-red-500/25"
                    }`}>
                      <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      {sl.dealScore.toFixed(1)}
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface-light to-transparent" />
                  {(sl.price || sl.estimatedPrice) && (
                    <div className="absolute bottom-2.5 left-3">
                      {sl.price ? (
                        <span className="text-sm font-bold text-white drop-shadow-lg">
                          {formatPrice(sl.price)}
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-amber-200/80 drop-shadow-lg">
                          ~{formatPrice(sl.estimatedPrice!)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-1.5">
                  <p className="text-[10px] font-medium text-gold uppercase tracking-wider">
                    {sl.brand}
                  </p>
                  <h3 className="text-sm font-semibold text-zinc-200 leading-snug line-clamp-2 group-hover:text-white transition-colors">
                    {sl.title}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {sl.year && (
                      <span className="text-[10px] text-zinc-500 bg-white/[0.04] px-2 py-0.5 rounded">
                        {sl.year}
                      </span>
                    )}
                    {sl.fuelType && (
                      <span className="text-[10px] text-zinc-500 bg-white/[0.04] px-2 py-0.5 rounded">
                        {sl.fuelType}
                      </span>
                    )}
                    {sl.city && (
                      <span className="text-[10px] text-zinc-500 bg-white/[0.04] px-2 py-0.5 rounded">
                        {sl.city}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Bottom spacer */}
      <div className="h-12" />
    </div>
  );
}
