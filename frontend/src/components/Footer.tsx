export default function Footer() {
  return (
    <footer className="relative mt-24">
      <div className="glow-line" />
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-gold-gradient rounded-lg flex items-center justify-center opacity-40">
              <span className="text-black font-black text-[7px] tracking-tight">VP</span>
            </div>
            <p className="text-[12px] text-zinc-600 font-medium">
              Voiture<span className="text-zinc-500">Premium</span>
            </p>
          </div>
          <p className="text-[11px] text-zinc-700 text-center sm:text-right">
            Annonces agrégées depuis Avito, Wandaloo et Moteur.ma
          </p>
        </div>
      </div>
    </footer>
  );
}
