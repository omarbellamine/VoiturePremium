interface ContactInfoProps {
  phone: string | null;
  url: string;
  source: string;
}

const SOURCE_LABELS: Record<string, string> = {
  avito: "Avito.ma",
  wandaloo: "Wandaloo.com",
  moteur: "Moteur.ma",
};

export default function ContactInfo({ phone, url, source }: ContactInfoProps) {
  return (
    <div className="flex flex-col gap-3">
      {phone && (
        <a
          href={`tel:${phone}`}
          className="group relative flex items-center gap-3 bg-gold-gradient text-black font-semibold px-5 py-3.5 rounded-xl transition-all duration-200 justify-center shadow-gold-sm hover:shadow-gold-md hover:scale-[1.02] active:scale-[0.98]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          <span className="text-sm">{phone}</span>
        </a>
      )}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 border border-white/[0.08] text-zinc-400 px-5 py-3 rounded-xl hover:border-gold/30 hover:text-gold transition-all duration-200 justify-center text-sm hover:bg-gold/[0.03]"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
        Voir sur {SOURCE_LABELS[source] || source}
      </a>
    </div>
  );
}
