"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";

export function SignOutButton() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function signOut() {
    setIsSigningOut(true);
    const response = await fetch("/api/auth/sign-out", { method: "POST" });

    if (response.ok || response.status === 401) {
      router.push("/");
      router.refresh();
      return;
    }

    setIsSigningOut(false);
  }

  return (
    <Link
      href="#"
      className="hover:text-zinc-950"
      onClick={() => void signOut()}
    >
      Sign out
    </Link>
  );
}
