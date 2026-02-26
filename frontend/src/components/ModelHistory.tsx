import { getBrandHistory } from "@/lib/modelHistory";

interface ModelHistoryProps {
  brand: string;
}

export default function ModelHistory({ brand }: ModelHistoryProps) {
  const history = getBrandHistory(brand);
  if (!history) return null;

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-white">
        À propos de {brand}
      </h2>

      <div className="bg-surface-light border border-white/[0.04] rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/[0.04]">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gold/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm0 0h9" />
              </svg>
              <span className="text-xs text-zinc-500">Fondée en {history.founded}</span>
            </div>
            <span className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gold/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs text-zinc-500">{history.country}</span>
            </div>
          </div>
          <p className="text-xs text-gold/70 italic mt-2">&laquo; {history.motto} &raquo;</p>
        </div>

        {/* Summary */}
        <div className="px-6 py-5 border-b border-white/[0.04]">
          <p className="text-sm text-zinc-400 leading-relaxed">
            {history.summary}
          </p>
        </div>

        {/* Key highlights */}
        <div className="px-6 py-5">
          <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-3">
            Points clés
          </p>
          <div className="space-y-2.5">
            {history.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold/50 flex-shrink-0" />
                <p className="text-sm text-zinc-300 leading-relaxed">{h}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
