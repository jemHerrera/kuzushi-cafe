"use client";

import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type {
  ApiErrorDetail,
  PaginatedResponse,
  PublicAccountSummary,
} from "@/lib/managers/types";
import { AlertBanner } from "./AlertBanner";
import { Avatar } from "./Avatar";
import { beltBorderStyles, cx } from "./shared";

export function PublicProfileSearch({
  onSelectProfile,
}: {
  onSelectProfile?: (profile: PublicAccountSummary) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [profiles, setProfiles] = useState<PublicAccountSummary[]>([]);
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setIsLoading(true);
      setError(undefined);
      try {
        const params = new URLSearchParams({ limit: "20", offset: "0" });
        if (query.trim()) params.set("search", query.trim());
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
  }, [isOpen, query]);

  function selectProfile(profile: PublicAccountSummary) {
    onSelectProfile?.(profile);
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <button
        type="button"
        className="flex h-11 w-full gap-3 items-center rounded-md border border-input bg-white px-3 text-left text-sm text-zinc-500 transition hover:bg-zinc-50 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        onClick={() => setIsOpen(true)}
      >
        <SearchIcon className="size-4 shrink-0 text-zinc-400" />
        <span className="min-w-0 flex-1 truncate">Search public profiles</span>
      </button>
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
            placeholder="Search training partners"
            value={query}
            onValueChange={setQuery}
          />
          <CommandList className="max-h-96">
            {error ? (
              <div className="p-3">
                <AlertBanner message={error} />
              </div>
            ) : null}
            <CommandEmpty>
              {isLoading ? "Searching profiles..." : "No profiles found."}
            </CommandEmpty>
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
