export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50 text-zinc-950">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8 sm:px-10">
        <header className="flex items-center justify-between border-b border-zinc-200 pb-5">
          <span className="text-sm font-semibold uppercase tracking-wide text-zinc-700">
            Kuzushi Cafe
          </span>
          <span className="rounded-full border border-zinc-300 px-3 py-1 text-sm text-zinc-600">
            Scaffold
          </span>
        </header>

        <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-wide text-emerald-700">
              Mindful mat notes
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-zinc-950 sm:text-6xl">
              Track grappling progress with intention.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-700">
              Kuzushi Cafe helps BJJ hobbyists record training sessions, reflect
              on problems, and turn journal entries into visible progress.
            </p>
          </div>

          <div
            aria-label="Initial product areas"
            className="grid gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
          >
            {[
              "Journal entries",
              "Saved techniques",
              "Friends and training partners",
              "Progress aggregates",
            ].map((item) => (
              <div
                key={item}
                className="rounded-md border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-800"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
