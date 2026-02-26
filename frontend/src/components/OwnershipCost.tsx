import { Listing } from "@/lib/types";
import { computeOwnershipCost } from "@/lib/ownershipCost";

interface OwnershipCostProps {
  listing: Listing;
}

function formatMAD(n: number): string {
  return new Intl.NumberFormat("fr-MA").format(n);
}

export default function OwnershipCost({ listing }: OwnershipCostProps) {
  const data = computeOwnershipCost(listing);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-bold text-white">
          Coût de possession estimé
        </h2>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-transparent bg-clip-text bg-gold-gradient">
            {formatMAD(data.totalMonthly)}
          </span>
          <span className="text-sm text-zinc-500">MAD/mois</span>
        </div>
      </div>

      {/* Annual breakdown cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {data.annualCosts.map((cost) => (
          <div
            key={cost.label}
            className="bg-surface-light border border-white/[0.04] rounded-xl p-4 space-y-2"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gold/50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {cost.icon.split(" M").map((d, i) => (
                  <path key={i} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={i === 0 ? d : `M${d}`} />
                ))}
              </svg>
              <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider leading-tight">
                {cost.label}
              </p>
            </div>
            <p className="text-lg font-bold text-zinc-200">
              {formatMAD(cost.annual)}
              <span className="text-xs text-zinc-500 font-normal ml-1">MAD/an</span>
            </p>
          </div>
        ))}
      </div>

      {/* Total bar */}
      <div className="bg-surface-light border border-gold/10 rounded-xl p-4 flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-400">Total annuel estimé</span>
        <span className="text-lg font-bold text-transparent bg-clip-text bg-gold-gradient">
          {formatMAD(data.totalAnnual)} MAD
        </span>
      </div>

      {/* Fuel info */}
      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <svg className="w-3.5 h-3.5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Consommation estimée : {data.fuelCostPer100km} MAD / 100 km ({listing.fuelType || "Essence"})
      </div>

      {/* Maintenance Timeline */}
      {data.timeline.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            Échéancier d&apos;entretien
          </h3>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[17px] top-3 bottom-3 w-px bg-white/[0.06]" />

            <div className="space-y-0">
              {data.timeline.map((event, i) => (
                <div key={i} className="relative flex items-start gap-4 py-3">
                  {/* Dot */}
                  <div className={`relative z-10 w-[9px] h-[9px] rounded-full mt-1.5 flex-shrink-0 ring-2 ring-surface ${
                    event.severity === "high"
                      ? "bg-red-400"
                      : event.severity === "medium"
                      ? "bg-amber-400"
                      : "bg-emerald-400"
                  }`} style={{ marginLeft: "13px" }} />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-zinc-300">
                        {event.km}
                      </span>
                      <span className={`text-xs font-bold ${
                        event.severity === "high"
                          ? "text-red-400"
                          : event.severity === "medium"
                          ? "text-amber-400"
                          : "text-emerald-400"
                      }`}>
                        ~{event.cost}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                      {event.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-[11px] text-zinc-600 text-center">
        Estimations basées sur les coûts moyens au Maroc pour la marque {listing.brand}. Les coûts réels varient selon l&apos;utilisation et l&apos;état du véhicule.
      </p>
    </div>
  );
}
