import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50">
      {/* Gold accent line */}
      <div className="glow-line" />

      <div className="glass-strong">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 bg-gold-gradient rounded-xl flex items-center justify-center shadow-gold-sm group-hover:shadow-gold-md transition-shadow duration-300">
              <span className="text-black font-black text-[11px] tracking-tight">VP</span>
            </div>
            <div className="flex items-baseline gap-0.5">
              <h1 className="text-[15px] font-bold text-white tracking-tight">
                Voiture
              </h1>
              <h1 className="text-[15px] font-bold text-gold tracking-tight">
                Premium
              </h1>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex text-[11px] text-zinc-500 font-medium tracking-wide uppercase">
              Maroc
            </span>
            <span className="hidden sm:block w-1 h-1 rounded-full bg-emerald-500/70 animate-glow-pulse" />
          </div>
        </div>
      </div>
    </header>
  );
}
