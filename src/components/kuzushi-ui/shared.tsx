import type { ComponentProps, ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";

export type Category =
  | "submission"
  | "sweep"
  | "reversal"
  | "back take"
  | "guard pass"
  | "tap";

export type Belt =
  | "unknown"
  | "white"
  | "blue"
  | "purple"
  | "brown"
  | "black"
  | "coral";
export type WeightClass = "unknown" | "feather" | "light" | "middle" | "heavy";
export type AgeClass =
  | "unknown"
  | "kid"
  | "teen"
  | "young-adult"
  | "30s"
  | "40s"
  | "50s"
  | "60s"
  | "70s"
  | "80s"
  | "90s";

export type Partner = {
  firstName: string;
  lastName: string;
  belt: Belt;
  weight: WeightClass;
  age: AgeClass;
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
  submission: "border-rose-200 bg-rose-50 !text-rose-800",
  sweep: "border-amber-200 bg-amber-50 !text-amber-800",
  reversal: "border-sky-200 bg-sky-50 !text-sky-800",
  "back take": "border-violet-200 bg-violet-50 !text-violet-800",
  "guard pass": "border-emerald-200 bg-emerald-50 !text-emerald-800",
  tap: "border-zinc-300 bg-zinc-100 !text-zinc-800",
};

export const beltStyles: Record<Belt, string> = {
  unknown: "bg-zinc-100 text-zinc-800 ring-zinc-300",
  white: "bg-white text-zinc-900 ring-zinc-300",
  blue: "bg-blue-600 text-white ring-blue-600",
  purple: "bg-purple-700 text-white ring-purple-700",
  brown: "bg-amber-900 text-white ring-amber-900",
  black: "bg-zinc-950 text-white ring-zinc-950",
  coral: "bg-red-500 text-white ring-red-500",
};

export const beltBorderStyles: Record<Belt, string> = {
  unknown: "border-zinc-300",
  white: "border-zinc-300",
  blue: "border-blue-600",
  purple: "border-purple-700",
  brown: "border-amber-900",
  black: "border-zinc-950",
  coral: "border-red-500",
};

export const categories = Object.keys(categoryStyles) as Category[];
export const belts: Belt[] = [
  "unknown",
  "white",
  "blue",
  "purple",
  "brown",
  "black",
  "coral",
];
export const weightClasses: WeightClass[] = [
  "unknown",
  "feather",
  "light",
  "middle",
  "heavy",
];
export const ageClasses: AgeClass[] = [
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
];

export const sampleTechniques: Technique[] = [
  { name: "Armbar from closed guard", category: "submission" },
  { name: "Flower sweep", category: "sweep" },
  { name: "Hip escape reset", category: "reversal" },
  { name: "Knee cut pass", category: "guard pass" },
];

export const samplePartners: Partner[] = [
  {
    firstName: "Maya",
    lastName: "Chen",
    belt: "purple",
    weight: "middle",
    age: "30s",
    initials: "MC",
  },
  {
    firstName: "Noah",
    lastName: "Reed",
    belt: "blue",
    weight: "light",
    age: "young-adult",
    initials: "NR",
  },
  {
    firstName: "Sam",
    lastName: "Ito",
    belt: "brown",
    weight: "heavy",
    age: "40s",
    initials: "SI",
  },
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

export function formatWeightClass(weight: Partner["weight"]) {
  return weight === "unknown" ? "Unknown weight" : weight;
}

export function formatWeightClassOption(weight: WeightClass) {
  const labels: Record<WeightClass, string> = {
    unknown: "Unknown",
    feather: "Feather (150 lb or less)",
    light: "Light (151-180 lb)",
    middle: "Middle (181-200 lb)",
    heavy: "Heavy (over 200 lb)",
  };

  return labels[weight];
}

export function formatAgeClass(age: Partner["age"]) {
  if (age === "unknown") return "Unknown age";
  if (age === "young-adult") return "young adult";

  return age;
}

export function formatAgeClassOption(age: AgeClass) {
  const labels: Record<AgeClass, string> = {
    unknown: "Unknown",
    kid: "Kid (under 12)",
    teen: "Teen",
    "young-adult": "Young adult (19-29)",
    "30s": "30s",
    "40s": "40s",
    "50s": "50s",
    "60s": "60s",
    "70s": "70s",
    "80s": "80s",
    "90s": "90s",
  };

  return labels[age];
}

export function formatBelt(belt: Belt) {
  return belt.charAt(0).toUpperCase() + belt.slice(1);
}

export function getPartnerProfileMeta(partner: Partner) {
  return `${formatWeightClass(partner.weight)} / ${formatAgeClass(partner.age)}`;
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <Label className="grid gap-2 text-sm font-medium leading-normal text-zinc-800">
      {label}
      {children}
    </Label>
  );
}

export const formControlClass =
  "h-11 rounded-md bg-white px-3 text-sm text-zinc-900";

const nativeSelectControlClass =
  "w-full [&_[data-slot=native-select]]:h-11 [&_[data-slot=native-select]]:rounded-md [&_[data-slot=native-select]]:bg-white [&_[data-slot=native-select]]:pl-2 [&_[data-slot=native-select]]:text-zinc-900";

export function TextInput({
  placeholder,
  value,
}: {
  placeholder?: string;
  value?: string;
}) {
  return (
    <Input
      className={formControlClass}
      defaultValue={value}
      placeholder={placeholder}
    />
  );
}

export function SelectInput({
  children,
  variant = "default",
  className,
  ...props
}: {
  children: ReactNode;
  variant?: "default" | "property";
} & Omit<ComponentProps<"select">, "children" | "size">) {
  return (
    <NativeSelect
      className={cx(
        nativeSelectControlClass,
        variant === "property" &&
          "w-fit max-w-full [&_[data-slot=native-select-icon]]:right-1.5 [&_[data-slot=native-select]]:h-8 [&_[data-slot=native-select]]:w-auto [&_[data-slot=native-select]]:max-w-full [&_[data-slot=native-select]]:border-transparent [&_[data-slot=native-select]]:bg-transparent [&_[data-slot=native-select]]:py-1 [&_[data-slot=native-select]]:pr-7 [&_[data-slot=native-select]]:shadow-none [&_[data-slot=native-select]]:hover:bg-zinc-100 [&_[data-slot=native-select]]:focus-visible:ring-2",
        className,
      )}
      size="default"
      {...props}
    >
      {children}
    </NativeSelect>
  );
}
