import { describe, expect, it } from "vitest";

import { getPublicEnv, getServerEnv } from "@/lib/env";

const validEnv = {
  NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
  NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
  SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
};

describe("env", () => {
  it("normalizes required public URLs", () => {
    expect(
      getPublicEnv({
        ...validEnv,
        NEXT_PUBLIC_SITE_URL: "http://localhost:3000/",
      }),
    ).toEqual({
      siteUrl: "http://localhost:3000",
      supabaseUrl: "http://127.0.0.1:54321",
      supabaseAnonKey: "anon-key",
    });
  });

  it("throws when a required public value is missing", () => {
    expect(() =>
      getPublicEnv({
        ...validEnv,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
      }),
    ).toThrow("Missing required environment variable");
  });

  it("throws when a required URL is invalid", () => {
    expect(() =>
      getPublicEnv({
        ...validEnv,
        NEXT_PUBLIC_SUPABASE_URL: "not-a-url",
      }),
    ).toThrow("Invalid URL");
  });

  it("returns server-only values separately", () => {
    expect(getServerEnv(validEnv).supabaseServiceRoleKey).toBe(
      "service-role-key",
    );
  });
});
