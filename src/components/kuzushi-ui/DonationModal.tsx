import { ButtonPrimary } from "./ButtonPrimary";
import { ModalFrame } from "./ModalFrame";
import { Field, TextInput } from "./shared";

export function DonationModal() {
  return (
    <ModalFrame title="Support Kuzushi Cafe">
      <p className="text-sm text-zinc-600">
        This app is free and built in my spare time. There are no ads, no
        subscriptions. Donations go directly toward keeping it running and
        making it better.
      </p>
      <div className="grid grid-cols-3 gap-2">
        {["$5", "$10", "$25"].map((amount) => (
          <button
            key={amount}
            className="h-10 rounded-md border border-zinc-300 bg-white text-sm font-semibold"
          >
            {amount}
          </button>
        ))}
      </div>
      <Field label="Custom amount">
        <TextInput placeholder="$" />
      </Field>
      <ButtonPrimary>Continue</ButtonPrimary>
    </ModalFrame>
  );
}
