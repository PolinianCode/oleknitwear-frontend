export default function ProductLoading() {
  return (
    <main className="bg-white min-h-screen pt-24 md:pt-32 pb-20 font-sans">
      <div className="container mx-auto px-4">
        <div className="h-3 w-48 bg-stone-100 rounded mb-8 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="aspect-[3/4] bg-stone-100 rounded animate-pulse" />
          <div className="space-y-6 py-4">
            <div className="h-3 w-20 bg-stone-100 rounded animate-pulse" />
            <div className="h-10 w-64 bg-stone-200 rounded animate-pulse" />
            <div className="h-6 w-24 bg-stone-100 rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-stone-50 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-stone-50 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-stone-50 rounded animate-pulse" />
            </div>
            <div className="h-14 w-full bg-stone-200 rounded animate-pulse mt-8" />
          </div>
        </div>
      </div>
    </main>
  );
}
