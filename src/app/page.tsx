import { BrandWordmark, SignInForm } from "@/components/kuzushi-ui";

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50 text-zinc-950">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8 sm:px-10">
        <header className="flex items-center justify-between border-b border-zinc-200 pb-5">
          <BrandWordmark label="KUZUSHI CAFE" compact />
        </header>

        <div className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-2">
          <div className="hidden max-w-2xl lg:block">
            <h1 className="text-5xl font-black italic leading-tight text-zinc-950 sm:text-6xl">
              Track grappling progress with intention.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-700">
              Kuzushi Cafe is a free grappling journaling and tracking app. No
              ads, no clutter, no persistent subscription popups.
            </p>
          </div>

          <div className="w-full rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-black text-zinc-950">Sign in</h2>
            <p className="mt-2 mb-6 text-sm leading-6 text-zinc-600">
              Continue with Google or receive a one-time sign-in link by email.
            </p>
            <SignInForm next="/app" />
          </div>
        </div>
      </section>
    </main>
  );
}
