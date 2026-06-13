"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type {
  ApiErrorDetail,
  PaginatedResponse,
  TechniqueTagDetail,
} from "@/lib/managers/types";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { LoadingState } from "./LoadingState";
import { ModalFrame } from "./ModalFrame";
import { useJournalFormOptions } from "./JournalFormOptionsProvider";
import { SavedTechniqueTagItem } from "./SavedTechniqueTagItem";
import { SavedTechniqueUpsert } from "./SavedTechniqueUpsert";
import { cx, type Category } from "./shared";
import { X } from "lucide-react";

const PAGE_SIZE = 100;

export function SavedTechniqueTagList({
  onClose,
  withinDialog = false,
  presentation = "modal",
  className,
}: {
  onClose?: () => void;
  withinDialog?: boolean;
  presentation?: "modal" | "sheet";
  className?: string;
}) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [techniques, setTechniques] = useState<TechniqueTagDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [mutationId, setMutationId] = useState<string>();
  const [refreshToken, setRefreshToken] = useState(0);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { removeTag, upsertTag } = useJournalFormOptions();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 200);
    return () => window.clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTechniques() {
      await Promise.resolve();
      if (controller.signal.aborted) return;
      setIsLoading(true);
      setError(undefined);
      try {
        const loaded: TechniqueTagDetail[] = [];
        for (let offset = 0; ; offset += PAGE_SIZE) {
          const params = new URLSearchParams({
            scope: "owned",
            limit: String(PAGE_SIZE),
            offset: String(offset),
          });
          if (debouncedQuery) params.set("search", debouncedQuery);
          const response = await fetch(`/api/technique-tags?${params}`, {
            signal: controller.signal,
          });
          if (!response.ok) throw await apiError(response);
          const data =
            (await response.json()) as PaginatedResponse<TechniqueTagDetail>;
          loaded.push(...data.items);
          if (data.items.length < PAGE_SIZE) break;
        }
        setTechniques(loaded);
      } catch (loadError) {
        if (controller.signal.aborted) return;
        setError(messageFor(loadError, "We could not load saved techniques."));
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    loadTechniques();
    return () => controller.abort();
  }, [debouncedQuery, refreshToken]);

  async function createTechnique(input: { label: string; category: Category }) {
    setMutationId("create");
    try {
      const response = await fetch("/api/technique-tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!response.ok) throw await apiError(response);
      upsertTag((await response.json()) as TechniqueTagDetail);
      setQuery("");
      setDebouncedQuery("");
      setRefreshToken((token) => token + 1);
    } finally {
      setMutationId(undefined);
    }
  }

  async function updateTechnique(
    technique: TechniqueTagDetail,
    changes: { label?: string; category?: Category },
  ) {
    setMutationId(technique.id);
    setError(undefined);
    try {
      const response = await fetch(`/api/technique-tags/${technique.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });
      if (!response.ok) throw await apiError(response);
      const updated = (await response.json()) as TechniqueTagDetail;
      upsertTag(updated);
      setTechniques((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
    } catch (updateError) {
      setError(messageFor(updateError, "We could not update this technique."));
      setRefreshToken((token) => token + 1);
    } finally {
      setMutationId(undefined);
    }
  }

  async function deleteTechnique(technique: TechniqueTagDetail) {
    setMutationId(technique.id);
    setError(undefined);
    try {
      const response = await fetch(`/api/technique-tags/${technique.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw await apiError(response);
      removeTag(technique.id);
      setRefreshToken((token) => token + 1);
    } catch (deleteError) {
      throw new Error(
        messageFor(deleteError, "We could not delete this technique."),
      );
    } finally {
      setMutationId(undefined);
    }
  }

  const command = (
    <Command
      className="min-h-0 flex-1 rounded-none bg-white p-0"
      shouldFilter={false}
    >
      <div className="px-1">
        <CommandInput
          aria-label="Search saved techniques"
          disabled={mutationId !== undefined}
          placeholder="Search saved techniques"
          value={query}
          onValueChange={setQuery}
        />
      </div>
      {error ? (
        <ErrorState
          className="p-2"
          message={error}
          onRetry={() => setRefreshToken((token) => token + 1)}
        />
      ) : null}
      {isLoading ? (
        <div className="p-2">
          <LoadingState label="Loading saved techniques" />
        </div>
      ) : null}
      {!isLoading && !error ? (
        <CommandList className="max-h-none min-h-0 flex-1 p-1">
          <CommandEmpty className="py-2">
            <EmptyState
              body={
                debouncedQuery
                  ? "Try a different search term."
                  : "Add techniques you want to reuse in journal entries."
              }
              className="mx-1"
              onAction={debouncedQuery ? undefined : () => setIsAddOpen(true)}
              actionLabel="Add saved technique"
              title={
                debouncedQuery
                  ? "No saved techniques found"
                  : "No saved techniques yet"
              }
            />
          </CommandEmpty>
          <CommandGroup className="grid gap-1.5">
            {techniques.map((technique) => (
              <CommandItem
                key={`${technique.id}-${technique.updatedAt}-${refreshToken}`}
                className="mb-2 min-h-0 rounded-md bg-white p-0 hover:bg-white focus-visible:bg-white data-selected:bg-white data-selected:text-zinc-950 [&>svg:last-child]:hidden"
                value={technique.id}
                onSelect={() => undefined}
              >
                <SavedTechniqueTagItem
                  technique={{
                    name: technique.label,
                    category: technique.category,
                  }}
                  disabled={mutationId !== undefined}
                  onNameChange={(label) =>
                    updateTechnique(technique, { label })
                  }
                  onCategoryChange={(category) =>
                    updateTechnique(technique, { category })
                  }
                  onDelete={() => deleteTechnique(technique)}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      ) : null}
    </Command>
  );

  const headerAction = (
    <SavedTechniqueUpsert
      open={isAddOpen}
      onOpenChange={setIsAddOpen}
      onSave={createTechnique}
    />
  );

  if (presentation === "sheet") {
    return (
      <section className={cx("flex min-h-0 flex-col bg-white", className)}>
        <div className="flex items-center justify-between gap-3 p-4 pb-0">
          <h2 className="text-lg font-bold text-zinc-950">Saved techniques</h2>
          <Button
            aria-label="Close"
            title="Close"
            type="button"
            variant="ghost"
            size="icon-lg"
            className="rounded-md text-zinc-700"
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="flex justify-end items-center p-2 w-full">
          {headerAction}
        </div>
        {command}
      </section>
    );
  }

  return (
    <ModalFrame
      title="Saved techniques"
      onClose={onClose}
      withinDialog={withinDialog}
      className="p-3 sm:p-5"
      headerAction={headerAction}
    >
      {command}
    </ModalFrame>
  );
}

async function apiError(response: Response) {
  const detail = (await response.json()) as ApiErrorDetail;
  return new Error(detail.error.message);
}

function messageFor(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}
