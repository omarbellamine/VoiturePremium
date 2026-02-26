import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gold-gradient rounded-lg flex items-center justify-center">
            <span className="text-black font-extrabold text-xs tracking-tight">VP</span>
          </div>
          <h1 className="text-sm font-bold text-white tracking-tight">
            Voiture<span className="text-gold">Premium</span>
          </h1>
        </Link>
      </div>
    </header>
  );
}
