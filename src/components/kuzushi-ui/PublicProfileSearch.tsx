"use client";

import { SearchIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type {
  ApiErrorDetail,
  PaginatedResponse,
  PublicAccountSummary,
} from "@/lib/managers/types";
import { Avatar } from "./Avatar";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { LoadingState } from "./LoadingState";
import { beltBorderStyles, cx } from "./shared";

export function PublicProfileSearch({
  onSelectProfile,
  open,
  onOpenChange,
  trigger = "field",
}: {
  onSelectProfile?: (profile: PublicAccountSummary) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: "field" | "icon";
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [profiles, setProfiles] = useState<PublicAccountSummary[]>([]);
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [retryToken, setRetryToken] = useState(0);
  const isOpen = open ?? internalOpen;
  const searchTerm = query.trim();

  function changeOpen(nextOpen: boolean) {
    if (open === undefined) setInternalOpen(nextOpen);
    onOpenChange?.(nextOpen);
  }

  useEffect(() => {
    if (!isOpen) return;
    if (!searchTerm) {
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setIsLoading(true);
      setError(undefined);
      try {
        const params = new URLSearchParams({ limit: "20", offset: "0" });
        params.set("search", searchTerm);
        const response = await fetch(`/api/accounts/search?${params}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          const detail = (await response.json()) as ApiErrorDetail;
          throw new Error(detail.error.message);
        }

        const result =
          (await response.json()) as PaginatedResponse<PublicAccountSummary>;
        setProfiles(result.items);
      } catch (loadError) {
        if (controller.signal.aborted) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "We could not search public profiles.",
        );
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }, 200);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [isOpen, retryToken, searchTerm]);

  function selectProfile(profile: PublicAccountSummary) {
    changeOpen(false);
    onSelectProfile?.(profile);
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    if (value.trim()) return;

    setProfiles([]);
    setError(undefined);
    setIsLoading(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={changeOpen}>
      {trigger === "icon" ? (
        <Button
          type="button"
          aria-label="Search public profiles"
          title="Search public profiles"
          variant="ghost"
          size="icon-lg"
          className="rounded-md text-zinc-700"
          onClick={() => changeOpen(true)}
        >
          <SearchIcon className="size-4" />
        </Button>
      ) : (
        <button
          type="button"
          className="flex h-11 w-full items-center gap-3 rounded-md border border-input bg-white px-3 text-left text-sm text-zinc-500 transition hover:bg-zinc-50 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          onClick={() => changeOpen(true)}
        >
          <SearchIcon className="size-4 shrink-0 text-zinc-400" />
          <span className="min-w-0 flex-1 truncate">
            Search public profiles
          </span>
        </button>
      )}
      <DialogContent
        className="gap-0 overflow-hidden p-0 sm:max-w-2xl"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Search public profiles</DialogTitle>
        <DialogDescription className="sr-only">
          Find training partners.
        </DialogDescription>
        <Command shouldFilter={false}>
          <CommandInput
            endAddon={
              <DialogClose asChild>
                <Button
                  type="button"
                  aria-label="Close public profile search"
                  title="Close public profile search"
                  variant="ghost"
                  size="icon-xs"
                >
                  <XIcon className="size-4" />
                </Button>
              </DialogClose>
            }
            endAddonClassName="sm:hidden"
            placeholder="Search training partners"
            value={query}
            onValueChange={handleQueryChange}
          />
          <CommandList className="max-h-96">
            {error ? (
              <ErrorState
                className="p-3"
                message={error}
                onRetry={() => setRetryToken((token) => token + 1)}
              />
            ) : null}
            {isLoading ? (
              <LoadingState
                className="p-3"
                label="Searching public profiles"
                rows={4}
              />
            ) : null}
            {!isLoading && !error && searchTerm && profiles.length === 0 ? (
              <EmptyState
                body="Try a different name or search term."
                className="m-3 py-8"
                title="No profiles found"
              />
            ) : null}
            {!isLoading && !error && profiles.length > 0 ? (
              <CommandGroup heading="">
                {profiles.map((profile) => (
                  <CommandItem
                    key={profile.id}
                    keywords={[
                      profile.firstName ?? "",
                      profile.lastName ?? "",
                      `${profile.firstName} ${profile.lastName}`,
                      profile.belt ?? "",
                      profile.relationshipStatus ?? "",
                    ]}
                    value={profile.id}
                    className="min-h-10 gap-3 rounded-md px-3 py-2 cursor-pointer"
                    onSelect={() => selectProfile(profile)}
                  >
                    <span
                      className={cx(
                        "inline-flex shrink-0 rounded-full border-[3px] p-0",
                        beltBorderStyles[profile.belt ?? "unknown"],
                      )}
                    >
                      <Avatar
                        initials={initialsForProfile(profile)}
                        src={profile.profilePhoto}
                        size="xs"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-zinc-950">
                        {displayName(profile)}
                      </span>
                      <span className="block truncate text-xs text-zinc-500">
                        {relationshipLabel(profile.relationshipStatus)}
                      </span>
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

function displayName(profile: PublicAccountSummary) {
  return (
    [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
    "Unnamed grappler"
  );
}

function initialsForProfile(profile: PublicAccountSummary) {
  return (
    [profile.firstName, profile.lastName]
      .filter(Boolean)
      .map((part) => part!.charAt(0).toUpperCase())
      .join("") || "KC"
  );
}

function relationshipLabel(status: PublicAccountSummary["relationshipStatus"]) {
  const labels: Record<NonNullable<typeof status>, string> = {
    none: "Not connected",
    "pending-inbound": "Request received",
    "pending-outbound": "Request sent",
    accepted: "Training partner",
    blocked: "Blocked",
    removed: "Removed",
  };

  return status ? labels[status] : "";
}
