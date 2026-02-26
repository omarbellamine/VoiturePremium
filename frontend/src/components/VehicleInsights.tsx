import { Listing } from "@/lib/types";
import { getVehicleInsights, CATEGORY_LABELS } from "@/lib/vehicleInsights";

interface VehicleInsightsProps {
  listing: Listing;
}

export default function VehicleInsights({ listing }: VehicleInsightsProps) {
  const { pros, cons } = getVehicleInsights(listing);

  if (pros.length === 0 && cons.length === 0) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">
        Ce qu&apos;il faut savoir sur ce véhicule
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Pros */}
        {pros.length > 0 && (
          <div className="bg-surface-light border border-white/[0.04] rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
                <svg className="w-4.5 h-4.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">
                Points forts
              </h3>
            </div>

            <div className="space-y-3">
              {pros.map((insight, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-zinc-300 leading-relaxed">{insight.text}</p>
                    <span className="text-[10px] text-zinc-600 uppercase tracking-wider">
                      {CATEGORY_LABELS[insight.category]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cons */}
        {cons.length > 0 && (
          <div className="bg-surface-light border border-white/[0.04] rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-500/15 border border-red-500/20 flex items-center justify-center">
                <svg className="w-4.5 h-4.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider">
                Points de vigilance
              </h3>
            </div>

            <div className="space-y-3">
              {cons.map((insight, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-zinc-300 leading-relaxed">{insight.text}</p>
                    <span className="text-[10px] text-zinc-600 uppercase tracking-wider">
                      {CATEGORY_LABELS[insight.category]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <p className="text-[11px] text-zinc-600 text-center">
        Ces informations sont générales et basées sur la marque, le kilométrage et l&apos;âge du véhicule. Une inspection mécanique reste recommandée avant tout achat.
      </p>
    </div>
  );
}
