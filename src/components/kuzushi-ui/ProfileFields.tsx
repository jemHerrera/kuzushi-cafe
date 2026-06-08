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

export function ProfileFields() {
  const bioId = useId();

  return (
    <div className="grid">
      <PropertyField icon={UserRound} label="First name">
        <TextInput
          aria-label="First name"
          placeholder="Add first name"
          value="Jem"
          variant="property"
        />
      </PropertyField>
      <PropertyField icon={UserRound} label="Last name">
        <TextInput
          aria-label="Last name"
          placeholder="Add last name"
          value="Herrera"
          variant="property"
        />
      </PropertyField>
      <PropertyField icon={Award} label="Belt">
        <SelectInput aria-label="Belt" variant="property">
          {belts.map((belt) => (
            <option key={belt} value={belt}>
              {formatBelt(belt)}
            </option>
          ))}
        </SelectInput>
      </PropertyField>
      <PropertyField icon={Scale} label="Weight">
        <SelectInput aria-label="Weight" variant="property">
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
          variant="property"
        />
      </PropertyField>
      <PropertyField icon={NotebookPen} label="Bio" htmlFor={bioId}>
        <Textarea
          id={bioId}
          className="min-h-10 resize-none border-transparent bg-transparent px-2 py-2 text-sm shadow-none hover:bg-zinc-100 focus-visible:border-transparent focus-visible:bg-zinc-100 focus-visible:ring-0"
          placeholder="Add bio"
        />
      </PropertyField>
    </div>
  );
}
