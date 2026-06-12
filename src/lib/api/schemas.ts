import { z } from "zod";

import { isSafeRelativePath } from "@/lib/auth/redirects";

export const belts = [
  "unknown",
  "white",
  "blue",
  "purple",
  "brown",
  "black",
  "coral",
] as const;
export const weights = [
  "unknown",
  "feather",
  "light",
  "middle",
  "heavy",
] as const;
export const ages = [
  "unknown",
  "kid",
  "teen",
  "young-adult",
  "30s",
  "40s",
  "50s",
  "60s",
  "70s",
  "80s",
  "90s",
] as const;
export const categories = [
  "submission",
  "takedown",
  "sweep",
  "guard-pass",
  "reversal",
  "back-take",
  "leg-entry",
  "escape",
  "tap",
  "off-balance",
  "position",
  "guard-retention",
  "other",
] as const;
export const intensities = ["playful", "casual", "intense"] as const;
export const journalTypes = ["attempt", "success"] as const;
export const privacyTypes = ["public", "training-partners", "private"] as const;

const optionalText = z.preprocess(
  (value) => (typeof value === "string" ? value.trim() || undefined : value),
  z.string().optional(),
);
const requiredText = z.string().trim().min(1);
const uuid = z.string().uuid();

export const pathIdSchema = z.object({ id: uuid });
export const pathKeySchema = z.object({
  id: z.string().trim().min(1).max(160),
});
export const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(25),
  offset: z.coerce.number().int().min(0).default(0),
});
export const techniqueTagScopes = ["visible", "owned"] as const;

export const signInSchema = z.discriminatedUnion("provider", [
  z.object({
    provider: z.literal("google"),
    redirectTo: z
      .string()
      .default("/app")
      .refine(isSafeRelativePath, "Invalid redirect path."),
  }),
  z.object({
    provider: z.literal("magic-link"),
    email: z
      .string()
      .trim()
      .email()
      .transform((value) => value.toLowerCase()),
    redirectTo: z
      .string()
      .default("/app")
      .refine(isSafeRelativePath, "Invalid redirect path."),
  }),
]);

const dateOnly = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return (
      !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
    );
  }, "Invalid date.");
export const dateOnlyToDate = dateOnly.transform(
  (value) => new Date(`${value}T00:00:00.000Z`),
);

export const accountUpdateSchema = z
  .object({
    firstName: optionalText,
    lastName: optionalText,
    bio: optionalText,
    profilePhoto: optionalText,
    belt: z.enum(belts).optional(),
    weight: z.enum(weights).optional(),
    birthday: dateOnlyToDate
      .refine(
        (date) => date.getTime() <= Date.now(),
        "Birthday cannot be in the future.",
      )
      .optional(),
  })
  .refine(
    (value) => Object.values(value).some((item) => item !== undefined),
    "At least one field is required.",
  );

export const privacyUpdateSchema = z
  .object({
    profile: z.enum(privacyTypes).optional(),
    journalEntries: z.enum(privacyTypes).optional(),
    submissions: z.enum(privacyTypes).optional(),
    sweeps: z.enum(privacyTypes).optional(),
    reversals: z.enum(privacyTypes).optional(),
    backtakes: z.enum(privacyTypes).optional(),
    guardPasses: z.enum(privacyTypes).optional(),
    taps: z.enum(privacyTypes).optional(),
  })
  .refine(
    (value) => Object.values(value).some((item) => item !== undefined),
    "At least one field is required.",
  );

export const searchPaginationSchema = paginationSchema.extend({
  search: optionalText,
});
export const requestDirectionSchema = paginationSchema.extend({
  direction: z.enum(["inbound", "outbound"]),
});

export const customPartnerSchema = z
  .object({
    firstName: optionalText,
    lastName: optionalText,
    partnerWeight: z.enum(weights).optional(),
    partnerAge: z.enum(ages).optional(),
    partnerBelt: z.enum(belts).optional(),
  })
  .refine(
    (value) => Object.values(value).some((item) => item !== undefined),
    "At least one partner detail is required.",
  );

const partnerFields = {
  trainingPartnerId: uuid.optional(),
  partnerFirstName: optionalText,
  partnerLastName: optionalText,
  partnerWeight: z.enum(weights).optional(),
  partnerAge: z.enum(ages).optional(),
  partnerBelt: z.enum(belts).optional(),
};
const partnerModeValid = (value: Record<string, unknown>) => {
  const custom = [
    "partnerFirstName",
    "partnerLastName",
    "partnerWeight",
    "partnerAge",
    "partnerBelt",
  ].some((key) => value[key] !== undefined);
  return !(value.trainingPartnerId && custom);
};

export const journalCreateSchema = z
  .object({
    name: requiredText,
    category: z.enum(categories),
    setup: requiredText,
    journalType: z.enum(journalTypes).optional(),
    notes: optionalText,
    intensity: z.enum(intensities).optional(),
    isNoGi: z.boolean().optional(),
    ...partnerFields,
    trainedDate: dateOnlyToDate.optional(),
    createNameTag: z.boolean().optional().default(false),
    createSetupTag: z.boolean().optional().default(false),
  })
  .refine(
    partnerModeValid,
    "Choose either an accepted training partner or custom partner details.",
  );

export const journalUpdateSchema = z
  .object({
    name: requiredText.optional(),
    category: z.enum(categories).optional(),
    setup: requiredText.optional(),
    journalType: z.enum(journalTypes).nullable().optional(),
    notes: optionalText,
    intensity: z.enum(intensities).nullable().optional(),
    isNoGi: z.boolean().nullable().optional(),
    ...partnerFields,
    trainingPartnerId: uuid.nullable().optional(),
    trainedDate: dateOnlyToDate.optional(),
  })
  .refine(
    (value) => Object.values(value).some((item) => item !== undefined),
    "At least one field is required.",
  )
  .refine(
    partnerModeValid,
    "Choose either an accepted training partner or custom partner details.",
  );

export const aggregateQuerySchema = z
  .object({
    category: z.enum(categories).optional(),
    timeline: z.enum(["week", "month", "year", "all", "custom"]),
    startDate: dateOnlyToDate.optional(),
    endDate: dateOnlyToDate.optional(),
    journalTypes: z.array(z.enum(journalTypes)).optional(),
  })
  .refine(
    (value) =>
      value.timeline !== "custom" || (value.startDate && value.endDate),
    "Custom timelines require startDate and endDate.",
  );

export const tagCreateSchema = z.object({
  label: requiredText,
  category: z.enum(categories),
});
export const tagUpdateSchema = z
  .object({
    label: requiredText.optional(),
    category: z.enum(categories).optional(),
  })
  .refine(
    (value) => Object.values(value).some((item) => item !== undefined),
    "At least one field is required.",
  );

export const donationCheckoutSchema = z.object({
  amount: z.number().int().min(1).max(10_000),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});
export const checkoutStatusSchema = z.object({
  sessionId: z.string().trim().min(1),
});

export function searchParamsObject(url: string) {
  return Object.fromEntries(new URL(url).searchParams.entries());
}

export function repeatedSearchParams(url: string, keys: string[]) {
  const params = new URL(url).searchParams;
  const result: Record<string, string | string[] | undefined> =
    Object.fromEntries(params.entries());
  for (const key of keys) {
    const values = [
      ...new Set(
        params
          .getAll(key)
          .flatMap((value) => value.split(","))
          .map((value) => value.trim())
          .filter(Boolean),
      ),
    ];
    result[key] = values.length ? values : undefined;
  }
  return result;
}
