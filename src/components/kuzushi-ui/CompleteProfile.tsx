import { ButtonPrimary } from "./ButtonPrimary";
import { ProfileFields } from "./ProfileFields";

export function CompleteProfile() {
  return (
    <main className="mx-auto grid min-h-screen w-full max-w-xl content-center gap-5 px-6 py-10">
      <h1 className="text-3xl font-black text-zinc-950">Complete profile</h1>
      <ProfileFields />
      <ButtonPrimary>Continue</ButtonPrimary>
    </main>
  );
}
