const Loading = () => {
  return (
    <div className="min-h-[70vh] bg-white">
      <div className="h-0.5 w-full overflow-hidden bg-zinc-100">
        <div className="route-progress-bar h-full w-1/2 bg-zinc-950" />
      </div>
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 md:px-8">
        <div className="grid gap-4 md:grid-cols-[1.35fr_0.65fr]">
          <div className="h-44 rounded-lg bg-zinc-100/80 sm:h-56 md:h-72" />
          <div className="hidden h-72 rounded-lg bg-zinc-100/70 md:block" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <div className="aspect-[4/3] rounded-lg bg-zinc-100" />
              <div className="h-4 w-4/5 rounded bg-zinc-100" />
              <div className="h-3 w-3/5 rounded bg-zinc-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
