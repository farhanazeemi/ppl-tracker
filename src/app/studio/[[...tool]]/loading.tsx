export default function StudioLoading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#090a0f] text-white select-none">
      <div className="w-12 h-12 rounded-2xl bg-amber-500 text-black flex items-center justify-center font-black text-xl tracking-wider shadow-lg shadow-amber-500/20 animate-pulse mb-4">
        PPL
      </div>
      <div className="text-sm font-mono uppercase tracking-widest text-zinc-300 font-bold mb-2">
        Sanity Studio Environment
      </div>
      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
        <span>Loading Editor Tools & Schemas...</span>
      </div>
    </div>
  );
}
