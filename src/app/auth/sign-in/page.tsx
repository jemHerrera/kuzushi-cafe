import { BrandWordmark, SignIn } from "@/components/kuzushi-ui";
import { safeRelativePath } from "@/lib/auth/redirects";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center bg-stone-50 px-6 py-12">
      <section className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <BrandWordmark href="/" />
        <SignIn
          next={safeRelativePath(params.next)}
          initialError={params.error}
          showTerms
          title="Sign in to your journal"
        />
      </section>
    </main>
  );
}
