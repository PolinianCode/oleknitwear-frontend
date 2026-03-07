export default function ShopLoading() {
  return (
    <main className="bg-stone-50 min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="h-3 w-32 bg-stone-200 rounded mb-6 animate-pulse" />
        <div className="h-12 w-64 bg-stone-200 rounded mb-4 animate-pulse" />
        <div className="h-4 w-full max-w-2xl bg-stone-100 rounded mb-12 animate-pulse" />

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-stone-200 rounded-sm" />
              <div className="mt-5 space-y-2 px-1">
                <div className="h-3 w-16 bg-stone-100 rounded" />
                <div className="h-5 w-40 bg-stone-200 rounded" />
                <div className="h-4 w-16 bg-stone-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
