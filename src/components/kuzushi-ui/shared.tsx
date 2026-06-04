import type { ReactNode } from "react";

export type Category =
  | "submission"
  | "sweep"
  | "reversal"
  | "back take"
  | "guard pass"
  | "tap";

export type Belt = "white" | "blue" | "purple" | "brown" | "black";

export type Partner = {
  firstName: string;
  lastName: string;
  belt: Belt;
  initials?: string;
};

export type Technique = {
  name: string;
  category: Category;
};

export type JournalEntry = {
  id: string;
  category: Category;
  technique: string;
  setup?: string;
  successful?: boolean;
  partner?: Partner;
  trainedDate: string;
};

export const categoryStyles: Record<Category, string> = {
  submission: "border-rose-200 bg-rose-50 text-rose-800",
  sweep: "border-amber-200 bg-amber-50 text-amber-800",
  reversal: "border-sky-200 bg-sky-50 text-sky-800",
  "back take": "border-violet-200 bg-violet-50 text-violet-800",
  "guard pass": "border-emerald-200 bg-emerald-50 text-emerald-800",
  tap: "border-zinc-300 bg-zinc-100 text-zinc-800",
};

export const beltStyles: Record<Belt, string> = {
  white: "bg-white text-zinc-900 ring-zinc-300",
  blue: "bg-blue-600 text-white ring-blue-600",
  purple: "bg-purple-700 text-white ring-purple-700",
  brown: "bg-amber-900 text-white ring-amber-900",
  black: "bg-zinc-950 text-white ring-zinc-950",
};

export const categories = Object.keys(categoryStyles) as Category[];

export const sampleTechniques: Technique[] = [
  { name: "Armbar from closed guard", category: "submission" },
  { name: "Flower sweep", category: "sweep" },
  { name: "Hip escape reset", category: "reversal" },
  { name: "Knee cut pass", category: "guard pass" },
];

export const samplePartners: Partner[] = [
  { firstName: "Maya", lastName: "Chen", belt: "purple", initials: "MC" },
  { firstName: "Noah", lastName: "Reed", belt: "blue", initials: "NR" },
  { firstName: "Sam", lastName: "Ito", belt: "brown", initials: "SI" },
];

export const sampleEntries: JournalEntry[] = [
  {
    id: "1",
    category: "submission",
    technique: "Armbar from closed guard",
    setup: "Collar grip break",
    successful: true,
    partner: samplePartners[0],
    trainedDate: "2026-06-02",
  },
  {
    id: "2",
    category: "guard pass",
    technique: "Knee cut pass",
    successful: false,
    partner: samplePartners[1],
    trainedDate: "2026-06-01",
  },
  {
    id: "3",
    category: "tap",
    technique: "Bow and arrow choke",
    trainedDate: "2026-05-30",
  },
];

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-zinc-800">
      {label}
      {children}
    </label>
  );
}

export function TextInput({
  placeholder,
  value,
}: {
  placeholder?: string;
  value?: string;
}) {
  return (
    <input
      className="h-11 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-900"
      defaultValue={value}
      placeholder={placeholder}
    />
  );
}

export function SelectInput({ children }: { children: ReactNode }) {
  return (
    <select className="h-11 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-900">
      {children}
    </select>
  );
}
