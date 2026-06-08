import { z } from "zod";

import { authenticatedApiContext } from "@/lib/api/context";
import { apiErrorResponse, readJson } from "@/lib/api/errors";
import {
  categories,
  paginationSchema,
  repeatedSearchParams,
  tagCreateSchema,
} from "@/lib/api/schemas";
import { JournalEntryManager } from "@/lib/managers/journal";

const querySchema = paginationSchema.extend({
  search: z.string().trim().min(1).optional(),
  category: z.enum(categories).optional(),
  sortField: z.enum(["label", "category", "createdAt"]).default("label"),
  sortDirection: z.enum(["asc", "desc"]).default("asc"),
});

export async function GET(request: Request) {
  try {
    const { supabase, accountId } = await authenticatedApiContext();
    const query = querySchema.parse(repeatedSearchParams(request.url, []));
    const { sortField, sortDirection, ...rest } = query;
    return Response.json(
      await new JournalEntryManager(supabase).getTags({
        filter: { accountId, search: rest.search, category: rest.category },
        sort: { field: sortField, direction: sortDirection },
        limit: rest.limit,
        offset: rest.offset,
      }),
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const { supabase, accountId } = await authenticatedApiContext();
    const input = tagCreateSchema.parse(await readJson(request));
    return Response.json(
      await new JournalEntryManager(supabase).createTag({
        ...input,
        generatedBy: accountId,
      }),
      { status: 201 },
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
