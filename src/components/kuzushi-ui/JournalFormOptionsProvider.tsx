"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  ApiErrorDetail,
  PaginatedResponse,
  TechniqueTagDetail,
  TrainingPartnerDetail,
} from "@/lib/managers/types";

type JournalFormOptionsContextValue = {
  tags: TechniqueTagDetail[];
  partners: TrainingPartnerDetail[];
  isLoading: boolean;
  error?: string;
  refresh: () => void;
  retry: () => void;
  upsertTag: (tag: TechniqueTagDetail) => void;
  removeTag: (id: string) => void;
  upsertPartner: (partner: TrainingPartnerDetail) => void;
};

const JournalFormOptionsContext =
  createContext<JournalFormOptionsContextValue | null>(null);

export function JournalFormOptionsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [tags, setTags] = useState<TechniqueTagDetail[]>([]);
  const [partners, setPartners] = useState<TrainingPartnerDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const requestRef = useRef<Promise<void> | null>(null);
  const hasLoadedRef = useRef(false);

  const loadOptions = useCallback((force = false) => {
    if (requestRef.current && !force) return requestRef.current;
    if (hasLoadedRef.current && !force) return Promise.resolve();

    setIsLoading(true);
    setError(undefined);
    const request = Promise.all([loadTechniqueTags(), loadTrainingPartners()])
      .then(([loadedTags, loadedPartners]) => {
        setTags(loadedTags);
        setPartners(loadedPartners);
        hasLoadedRef.current = true;
      })
      .catch((loadError) => {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "We could not load journal form options.",
        );
      })
      .finally(() => {
        if (requestRef.current === request) {
          requestRef.current = null;
        }
        setIsLoading(false);
      });
    requestRef.current = request;
    return request;
  }, []);

  const refresh = useCallback(() => {
    void loadOptions();
  }, [loadOptions]);

  return (
    <JournalFormOptionsContext.Provider
      value={{
        tags,
        partners,
        isLoading,
        error,
        refresh,
        retry: () => {
          requestRef.current = null;
          void loadOptions(true);
        },
        upsertTag: (tag) =>
          setTags((current) => {
            const withoutTag = current.filter((item) => item.id !== tag.id);
            return [...withoutTag, tag];
          }),
        removeTag: (id) =>
          setTags((current) => current.filter((tag) => tag.id !== id)),
        upsertPartner: (partner) =>
          setPartners((current) => {
            const withoutPartner = current.filter(
              (item) => item.id !== partner.id,
            );
            return [...withoutPartner, partner];
          }),
      }}
    >
      {children}
    </JournalFormOptionsContext.Provider>
  );
}

export function useJournalFormOptions() {
  return useContext(JournalFormOptionsContext) ?? emptyJournalFormOptions;
}

const emptyJournalFormOptions: JournalFormOptionsContextValue = {
  tags: [],
  partners: [],
  isLoading: false,
  refresh: () => undefined,
  retry: () => undefined,
  upsertTag: () => undefined,
  removeTag: () => undefined,
  upsertPartner: () => undefined,
};

async function loadTechniqueTags() {
  return loadAllPages<TechniqueTagDetail>("/api/technique-tags");
}

async function loadTrainingPartners() {
  return loadAllPages<TrainingPartnerDetail>("/api/training-partners");
}

async function loadAllPages<T>(path: string) {
  const pageSize = 100;
  const items: T[] = [];

  for (let offset = 0; ; offset += pageSize) {
    const params = new URLSearchParams({
      limit: String(pageSize),
      offset: String(offset),
    });
    const response = await fetch(`${path}?${params}`);
    if (!response.ok) {
      const detail = (await response.json()) as ApiErrorDetail;
      throw new Error(detail.error.message);
    }

    const data = (await response.json()) as PaginatedResponse<T>;
    items.push(...data.items);
    if (data.items.length < pageSize) return items;
  }
}
