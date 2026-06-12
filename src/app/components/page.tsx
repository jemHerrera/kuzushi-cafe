"use client";

import {
  AggregateOverview,
  AggregateView,
  AggregateViewFilters,
  AlertBanner,
  Avatar,
  BrandWordmark,
  ButtonPrimary,
  ButtonSecondary,
  CompleteProfile,
  CustomPartnerInput,
  DateSelector,
  DonationBanner,
  DonationModal,
  EmptyState,
  Header,
  IconButton,
  JournalEntryCreate,
  JournalEntryFilters,
  JournalEntryHeading,
  JournalEntryPagination,
  JournalEntryRow,
  JournalEntrySearch,
  JournalEntryTable,
  JournalEntryUpdate,
  LoadingState,
  MyProfile,
  NotificationItem,
  NotificationList,
  PrivacySettings,
  PublicProfile,
  PublicProfileSearch,
  SavedTechniqueSearch,
  SavedTechniqueTagItem,
  SavedTechniqueTagList,
  SavedTechniqueUpsert,
  Search,
  SidePanel,
  StatsChart,
  StatsRow,
  TechniqueCategoryPill,
  TechniqueCategoryPillSelect,
  TechniqueTagSelectMenu,
  TrainingPartnerInput,
  TrainingPartnerSearch,
  TrainingPartnerSelectMenu,
  TrainingPartnersListModal,
  UserSummary,
} from "@/components/kuzushi-ui";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import type { AccountDetail, PublicAccountSummary } from "@/lib/managers/types";
import { sampleEntries } from "@/components/kuzushi-ui/shared";
import { sampleAggregate } from "@/components/kuzushi-ui/AggregateOverview";

const sampleAccount: AccountDetail = {
  id: "component-library-account",
  object: "account",
  firstName: "Maya",
  lastName: "Chen",
  email: "maya@example.com",
  belt: "purple",
  weight: "middle",
  createdAt: 0,
  updatedAt: 0,
};

const samplePublicProfile: PublicAccountSummary = {
  id: "component-library-public-profile",
  object: "public_account_summary",
  firstName: "Maya",
  lastName: "Chen",
  bio: "Purple belt focused on guard retention, sweeps, and technical rounds.",
  belt: "purple",
  relationshipStatus: "none",
};

const sections = [
  {
    title: "Actions",
    items: [
      { name: "ButtonPrimary", element: <ButtonPrimary /> },
      { name: "ButtonSecondary", element: <ButtonSecondary /> },
      {
        name: "IconButton",
        element: (
          <IconButton
            label="Example icon button"
            icon={<Plus className="size-4" />}
          />
        ),
      },
    ],
  },
  {
    title: "Search",
    items: [
      { name: "Search", element: <Search /> },
      { name: "JournalEntrySearch", element: <JournalEntrySearch /> },
      { name: "TrainingPartnerSearch", element: <TrainingPartnerSearch /> },
      { name: "PublicProfileSearch", element: <PublicProfileSearch /> },
      { name: "SavedTechniqueSearch", element: <SavedTechniqueSearch /> },
    ],
  },
  {
    title: "Identity",
    items: [
      { name: "Avatar", element: <Avatar /> },
      { name: "UserSummary", element: <UserSummary /> },
      {
        name: "TechniqueCategoryPill",
        element: <TechniqueCategoryPill category="submission" />,
      },
      { name: "NotificationItem", element: <NotificationItem /> },
    ],
  },
  {
    title: "Menus",
    items: [
      { name: "TechniqueTagSelectMenu", element: <TechniqueTagSelectMenu /> },
      {
        name: "TrainingPartnerSelectMenu",
        element: <TrainingPartnerSelectMenu />,
      },
      {
        name: "TechniqueCategoryPillSelect",
        element: <TechniqueCategoryPillSelect />,
      },
      { name: "DateSelector", element: <DateSelector /> },
    ],
  },

  {
    title: "Panels",
    items: [
      { name: "Header", element: <Header /> },
      {
        name: "SidePanel",
        element: (
          <SidePanel account={sampleAccount} onAction={() => undefined} />
        ),
      },
      { name: "NotificationList", element: <NotificationList /> },
      { name: "SavedTechniqueTagList", element: <SavedTechniqueTagList /> },
    ],
  },
  {
    title: "Partners",
    items: [
      { name: "CustomPartnerInput", element: <CustomPartnerInput /> },
      {
        name: "TrainingPartnersListModal",
        element: <TrainingPartnersListModal />,
      },
      { name: "TrainingPartnerInput", element: <TrainingPartnerInput /> },
    ],
  },
  {
    title: "Journal",
    items: [
      { name: "JournalEntryCreate", element: <JournalEntryCreate /> },
      {
        name: "JournalEntryUpdate",
        element: <JournalEntryUpdate entry={sampleEntries[0]} />,
      },
      { name: "JournalEntryFilters", element: <JournalEntryFilters /> },
      {
        name: "JournalEntryHeading",
        element: (
          <table className="w-full">
            <JournalEntryHeading />
          </table>
        ),
      },
      {
        name: "JournalEntryRow",
        element: (
          <div className="overflow-x-auto">
            <table className="min-w-[860px] w-full">
              <tbody>
                <JournalEntryRow
                  entry={{
                    id: "library",
                    category: "sweep",
                    technique: "Flower sweep",
                    setup: "Cross sleeve grip",
                    journalType: "success",
                    trainedDate: "2026-06-03",
                  }}
                />
              </tbody>
            </table>
          </div>
        ),
      },
      { name: "JournalEntryPagination", element: <JournalEntryPagination /> },
      {
        name: "JournalEntryTable",
        element: (
          <Suspense>
            <JournalEntryTable entries={sampleEntries} />
          </Suspense>
        ),
      },
    ],
  },
  {
    title: "Profile",
    items: [
      { name: "MyProfile", element: <MyProfile /> },
      { name: "CompleteProfile", element: <CompleteProfile /> },
      { name: "PrivacySettings", element: <PrivacySettings /> },
      {
        name: "PublicProfile",
        element: (
          <PublicProfile
            accountId={samplePublicProfile.id}
            initialProfile={samplePublicProfile}
          />
        ),
      },
    ],
  },
  {
    title: "Saved Techniques",
    items: [
      { name: "SavedTechniqueTagItem", element: <SavedTechniqueTagItem /> },
      { name: "SavedTechniqueUpsert", element: <SavedTechniqueUpsert /> },
    ],
  },
  {
    title: "Feedback",
    items: [
      { name: "AlertBanner", element: <AlertBanner /> },
      { name: "DonationBanner", element: <DonationBanner /> },
      { name: "DonationModal", element: <DonationModal /> },
      { name: "LoadingState", element: <LoadingState /> },
      { name: "EmptyState", element: <EmptyState /> },
    ],
  },
  {
    title: "Stats",
    items: [
      {
        name: "StatsChart",
        element: <StatsChart data={sampleAggregate.series} />,
      },
      { name: "StatsRow", element: <StatsRow /> },
      { name: "AggregateViewFilters", element: <AggregateViewFilters /> },
      {
        name: "AggregateView",
        element: <AggregateView data={sampleAggregate} />,
      },
      {
        name: "AggregateOverview",
        element: <AggregateOverview data={sampleAggregate} />,
      },
    ],
  },
];

export default function ComponentsPage() {
  return (
    <main className="min-h-screen bg-stone-50 px-4 py-8 text-zinc-950 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-8">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-200 pb-6">
          <div>
            <BrandWordmark href="/" />
            <h1 className="mt-2 text-4xl font-black">Component library</h1>
          </div>
          <Link className="text-sm font-semibold text-zinc-700" href="/">
            Back to home
          </Link>
        </header>

        {sections.map((section) => (
          <section key={section.title} className="grid gap-4">
            <h2 className="text-2xl font-black text-zinc-950">
              {section.title}
            </h2>
            <div className="grid gap-4">
              {section.items.map((item) => (
                <article
                  key={item.name}
                  className="grid gap-3 rounded-lg border border-zinc-200 bg-white/70 p-4"
                >
                  <h3 className="text-sm font-bold uppercase text-zinc-500">
                    {item.name}
                  </h3>
                  <div className="min-w-0 rounded-md bg-stone-50 p-4">
                    {item.element}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
