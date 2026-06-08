type EnvSource = Record<string, string | undefined>;

type PublicEnv = {
  siteUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
};

type ServerEnv = PublicEnv & {
  supabaseServiceRoleKey?: string;
  stripeSecretKey?: string;
};

function requiredEnv(source: EnvSource, key: string): string {
  const value = source[key]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

function requiredUrl(source: EnvSource, key: string): string {
  const value = requiredEnv(source, key);

  try {
    return new URL(value).toString().replace(/\/$/, "");
  } catch {
    throw new Error(`Invalid URL in environment variable: ${key}`);
  }
}

export function getPublicEnv(source: EnvSource = process.env): PublicEnv {
  return {
    siteUrl: requiredUrl(source, "NEXT_PUBLIC_SITE_URL"),
    supabaseUrl: requiredUrl(source, "NEXT_PUBLIC_SUPABASE_URL"),
    supabaseAnonKey: requiredEnv(source, "NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  };
}

export function getServerEnv(source: EnvSource = process.env): ServerEnv {
  return {
    ...getPublicEnv(source),
    supabaseServiceRoleKey: source.SUPABASE_SERVICE_ROLE_KEY?.trim(),
    stripeSecretKey: source.STRIPE_SECRET_KEY?.trim(),
  };
}
