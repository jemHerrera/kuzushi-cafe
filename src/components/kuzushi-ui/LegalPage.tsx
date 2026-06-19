import Link from "next/link";
import type { ReactNode } from "react";

import { BrandWordmark } from "./BrandWordmark";

export function LegalPage({
  title,
  description,
  effectiveDate,
  children,
}: {
  title: string;
  description: string;
  effectiveDate: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-stone-50 text-zinc-950">
      <div className="mx-auto w-full max-w-4xl px-6 py-8 sm:px-10 sm:py-12">
        <header className="flex items-center justify-between border-b border-zinc-200 pb-5">
          <BrandWordmark href="/" />
        </header>

        <article className="mt-10 rounded-xl border border-zinc-200 bg-white px-6 py-8 shadow-sm sm:px-10 sm:py-12">
          <div className="border-b border-zinc-200 pb-8">
            <h1 className="mt-3 text-4xl font-black italic tracking-tight sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
              {description}
            </p>
            <p className="mt-4 text-sm font-medium text-zinc-500">
              Effective {effectiveDate}
            </p>
          </div>

          <div className="mt-8 grid gap-9 text-[15px] leading-7 text-zinc-700 [&_a]:font-semibold [&_a]:text-zinc-950 [&_a]:underline [&_a]:underline-offset-4 [&_h2]:text-xl [&_h2]:font-black [&_h2]:text-zinc-950 [&_li]:pl-1 [&_p+p]:mt-3 [&_ul]:mt-3 [&_ul]:grid [&_ul]:list-disc [&_ul]:gap-2 [&_ul]:pl-5">
            {children}
          </div>
        </article>

        <footer className="flex flex-wrap gap-x-5 gap-y-2 py-8 text-sm text-zinc-600">
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
      </div>
    </main>
  );
}
