import { Listing } from "@/lib/types";
import ListingCard from "./ListingCard";

interface ListingGridProps {
  listings: Listing[];
}

export default function ListingGrid({ listings }: ListingGridProps) {
  if (listings.length === 0) {
    return (
      <div className="text-center py-32 animate-fade-in">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl glass flex items-center justify-center">
          <svg className="w-9 h-9 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-zinc-200 mb-2">Aucune annonce trouvée</h3>
        <p className="text-sm text-zinc-600 max-w-sm mx-auto leading-relaxed">
          Essayez de modifier vos filtres ou votre recherche pour trouver des résultats
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
