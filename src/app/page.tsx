import Link from "next/link";

import { BrandWordmark, SignIn } from "@/components/kuzushi-ui";

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50 text-zinc-950">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8 sm:px-10">
        <header className="flex items-center justify-between border-b border-zinc-200 pb-5">
          <BrandWordmark label="KUZUSHI CAFE" />
        </header>

        <div className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-2">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-black italic leading-tight text-zinc-950 sm:text-5xl">
              Track grappling progress with intention.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-700">
              Kuzushi Cafe is a humble grappling journaling and tracking app.
              Completely free, with no ads, no clutter, no persistent
              subscription popups.
            </p>
          </div>

          <SignIn next="/app" />
        </div>

        <footer className="flex flex-wrap gap-x-5 gap-y-2 border-t border-zinc-200 py-5 text-sm text-zinc-600">
          <Link className="hover:text-zinc-950" href="/privacy-policy">
            Privacy Policy
          </Link>
          <Link className="hover:text-zinc-950" href="/terms-of-service">
            Terms of Service
          </Link>
          <a className="hover:text-zinc-950" href="mailto:hello@kuzushi.cafe">
            Contact
          </a>
        </footer>
      </section>
    </main>
  );
}
