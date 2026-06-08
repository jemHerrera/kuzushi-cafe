"use client";

import { Award, Cake, NotebookPen, Scale, UserRound } from "lucide-react";
import { useId } from "react";
import { Textarea } from "@/components/ui/textarea";
import { DateSelector } from "./DateSelector";
import { PropertyField } from "./PropertyField";
import {
  belts,
  formatBelt,
  formatWeightClassOption,
  SelectInput,
  TextInput,
  weightClasses,
} from "./shared";

export type ProfileFormValue = {
  firstName: string;
  lastName: string;
  belt: (typeof belts)[number];
  weight: (typeof weightClasses)[number];
  birthday?: Date;
  bio: string;
};

export const sampleProfileValue: ProfileFormValue = {
  firstName: "Jem",
  lastName: "Herrera",
  belt: "blue",
  weight: "middle",
  birthday: undefined,
  bio: "",
};

export function ProfileFields({
  value,
  onChange,
  disabled = false,
}: {
  value: ProfileFormValue;
  onChange: (value: ProfileFormValue) => void;
  disabled?: boolean;
}) {
  const bioId = useId();

  return (
    <div className="grid">
      <PropertyField icon={UserRound} label="First name">
        <TextInput
          aria-label="First name"
          placeholder="Add first name"
          value={value.firstName}
          onChange={(event) =>
            onChange({ ...value, firstName: event.target.value })
          }
          disabled={disabled}
          required
          variant="property"
        />
      </PropertyField>
      <PropertyField icon={UserRound} label="Last name">
        <TextInput
          aria-label="Last name"
          placeholder="Add last name"
          value={value.lastName}
          onChange={(event) =>
            onChange({ ...value, lastName: event.target.value })
          }
          disabled={disabled}
          required
          variant="property"
        />
      </PropertyField>
      <PropertyField icon={Award} label="Belt">
        <SelectInput
          aria-label="Belt"
          value={value.belt}
          onChange={(event) =>
            onChange({
              ...value,
              belt: event.target.value as ProfileFormValue["belt"],
            })
          }
          disabled={disabled}
          variant="property"
        >
          {belts.map((belt) => (
            <option key={belt} value={belt}>
              {formatBelt(belt)}
            </option>
          ))}
        </SelectInput>
      </PropertyField>
      <PropertyField icon={Scale} label="Weight">
        <SelectInput
          aria-label="Weight"
          value={value.weight}
          onChange={(event) =>
            onChange({
              ...value,
              weight: event.target.value as ProfileFormValue["weight"],
            })
          }
          disabled={disabled}
          variant="property"
        >
          {weightClasses.map((weight) => (
            <option key={weight} value={weight}>
              {formatWeightClassOption(weight)}
            </option>
          ))}
        </SelectInput>
      </PropertyField>
      <PropertyField icon={Cake} label="Birthday">
        <DateSelector
          ariaLabel="Birthday"
          placeholder="Add birthday"
          value={value.birthday}
          onValueChange={(birthday) => onChange({ ...value, birthday })}
          disabled={disabled}
          variant="property"
        />
      </PropertyField>
      <PropertyField icon={NotebookPen} label="Bio" htmlFor={bioId}>
        <Textarea
          id={bioId}
          className="min-h-10 resize-none border-transparent bg-transparent px-2 py-2 text-sm shadow-none hover:bg-zinc-100 focus-visible:border-transparent focus-visible:bg-zinc-100 focus-visible:ring-0"
          placeholder="Add bio"
          value={value.bio}
          onChange={(event) => onChange({ ...value, bio: event.target.value })}
          disabled={disabled}
        />
      </PropertyField>
    </div>
  );
}
