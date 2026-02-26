import { Listing } from "@/lib/types";

interface DealScoreProps {
  listing: Listing;
}

const SCORE_LABELS: { key: keyof NonNullable<Listing["dealScoreDetails"]>; label: string; max: number }[] = [
  { key: "priceValue", label: "Rapport qualité-prix", max: 3 },
  { key: "mileageRisk", label: "Kilométrage", max: 2 },
  { key: "age", label: "Âge / Entretien", max: 2 },
  { key: "completeness", label: "Fiabilité annonce", max: 1.5 },
  { key: "sellerTrust", label: "Confiance vendeur", max: 1.5 },
];

function getScoreColor(score: number): string {
  if (score >= 7) return "text-emerald-400";
  if (score >= 5) return "text-amber-400";
  return "text-red-400";
}

function getScoreBg(score: number): string {
  if (score >= 7) return "bg-emerald-400";
  if (score >= 5) return "bg-amber-400";
  return "bg-red-400";
}

function getScoreRingBg(score: number): string {
  if (score >= 7) return "bg-emerald-500/15 border-emerald-500/25";
  if (score >= 5) return "bg-amber-500/15 border-amber-500/25";
  return "bg-red-500/15 border-red-500/25";
}

function getScoreLabel(score: number): string {
  if (score >= 8) return "Excellente affaire";
  if (score >= 7) return "Bonne affaire";
  if (score >= 5) return "Correct";
  if (score >= 3) return "À vérifier";
  return "Risqué";
}

function getBarColor(value: number, max: number): string {
  const ratio = value / max;
  if (ratio >= 0.7) return "bg-emerald-400";
  if (ratio >= 0.4) return "bg-amber-400";
  return "bg-red-400";
}

export default function DealScore({ listing }: DealScoreProps) {
  if (listing.dealScore == null || !listing.dealScoreDetails) return null;

  const score = listing.dealScore;
  const details = listing.dealScoreDetails;

  return (
    <div className="bg-surface-light border border-white/[0.04] rounded-2xl p-6 space-y-5">
      {/* Header with score */}
      <div className="flex items-center gap-4">
        <div className={`relative w-16 h-16 rounded-2xl border flex items-center justify-center ${getScoreRingBg(score)}`}>
          <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
            {score.toFixed(1)}
          </span>
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">Score de l&apos;offre</h3>
          <p className={`text-sm font-medium ${getScoreColor(score)}`}>
            {getScoreLabel(score)}
          </p>
        </div>
      </div>

      {/* Score breakdown */}
      <div className="space-y-3">
        {SCORE_LABELS.map(({ key, label, max }) => {
          const value = details[key];
          const pct = Math.min(100, (value / max) * 100);
          return (
            <div key={key} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">{label}</span>
                <span className="text-xs font-medium text-zinc-300">
                  {value}/{max}
                </span>
              </div>
              <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${getBarColor(value, max)}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="pt-3 border-t border-white/[0.04]">
        <div className="flex items-center gap-4 text-[10px] text-zinc-600">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${getScoreBg(8)}`} />
            <span>Bon</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${getScoreBg(5)}`} />
            <span>Moyen</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${getScoreBg(2)}`} />
            <span>Risqué</span>
          </div>
        </div>
      </div>
    </div>
  );
}
