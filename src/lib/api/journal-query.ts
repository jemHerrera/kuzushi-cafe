import { z } from "zod";

import { categories, journalTypes, paginationSchema } from "@/lib/api/schemas";
import type {
  JournalEntryFilters,
  JournalEntrySort,
} from "@/lib/managers/types";

const sortFields = [
  "trainedAt",
  "category",
  "name",
  "journalType",
  "trainingPartner",
] as const;
const defaultJournalLimit = 7;
const querySchema = paginationSchema.extend({
  search: z.string().trim().min(1).optional(),
  category: z.array(z.enum(categories)).optional(),
  journalTypes: z.array(z.enum(journalTypes)).optional(),
  isNoGi: z.boolean().optional(),
  sortField: z.enum(sortFields).default("trainedAt"),
  sortDirection: z.enum(["asc", "desc"]).default("desc"),
  limit: paginationSchema.shape.limit.default(defaultJournalLimit),
});

export type JournalQuery = {
  filter: JournalEntryFilters;
  sort: JournalEntrySort;
  limit: number;
  offset: number;
};

function list(params: URLSearchParams, key: string) {
  return [
    ...new Set(
      params
        .getAll(key)
        .flatMap((value) => value.split(","))
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  ];
}

export function parseJournalQuery(input: URL | string): JournalQuery {
  const params =
    typeof input === "string"
      ? new URL(input).searchParams
      : input.searchParams;
  const parsed = querySchema.parse({
    search: params.get("search") || undefined,
    category: list(params, "category").length
      ? list(params, "category")
      : undefined,
    journalTypes: list(params, "journalTypes").length
      ? list(params, "journalTypes")
      : undefined,
    isNoGi: params.has("isNoGi")
      ? z.stringbool().parse(params.get("isNoGi"))
      : undefined,
    sortField: params.get("sortField") || undefined,
    sortDirection: params.get("sortDirection") || undefined,
    limit: params.get("limit") || undefined,
    offset: params.get("offset") || undefined,
  });
  return {
    filter: {
      search: parsed.search,
      category: parsed.category,
      journalTypes: parsed.journalTypes,
      isNoGi: parsed.isNoGi,
    },
    sort: { field: parsed.sortField, direction: parsed.sortDirection },
    limit: parsed.limit,
    offset: parsed.offset,
  };
}

export function serializeJournalQuery(query: JournalQuery) {
  const params = new URLSearchParams();
  if (query.filter.search?.trim())
    params.set("search", query.filter.search.trim());
  query.filter.category?.forEach((value) => params.append("category", value));
  query.filter.journalTypes?.forEach((value) =>
    params.append("journalTypes", value),
  );
  if (query.filter.isNoGi !== undefined)
    params.set("isNoGi", String(query.filter.isNoGi));
  if (query.sort.field !== "trainedAt")
    params.set("sortField", query.sort.field);
  if (query.sort.direction !== "desc")
    params.set("sortDirection", query.sort.direction);
  if (query.limit !== defaultJournalLimit)
    params.set("limit", String(query.limit));
  if (query.offset) params.set("offset", String(query.offset));
  return params;
}

export function updateJournalQuery(
  current: JournalQuery,
  update: Partial<Omit<JournalQuery, "filter" | "sort">> & {
    filter?: Partial<JournalEntryFilters>;
    sort?: Partial<JournalEntrySort>;
  },
) {
  const changesCriteria = Boolean(update.filter || update.sort);
  return {
    ...current,
    ...update,
    filter: { ...current.filter, ...update.filter },
    sort: { ...current.sort, ...update.sort },
    offset: changesCriteria ? 0 : (update.offset ?? current.offset),
  };
}
