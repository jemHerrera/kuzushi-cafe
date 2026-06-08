"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

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
    <Button
      type="button"
      variant="outline"
      disabled={isSigningOut}
      onClick={() => void signOut()}
    >
      {isSigningOut ? "Signing out..." : "Sign out"}
    </Button>
  );
}
