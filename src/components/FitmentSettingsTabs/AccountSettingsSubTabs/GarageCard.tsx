export function GarageCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      {children}
    </div>
  );
}
