import { ButtonPrimary } from "./ButtonPrimary";
import { ModalFrame } from "./ModalFrame";
import { Field, TextInput } from "./shared";

export function DonationModal({
  onClose,
  withinDialog = false,
}: {
  onClose?: () => void;
  withinDialog?: boolean;
}) {
  return (
    <ModalFrame
      title="Support Kuzushi Cafe"
      onClose={onClose}
      withinDialog={withinDialog}
      className="p-3 sm:p-5"
    >
      <p className="text-sm text-zinc-600">
        This app is free and built in my spare time. There are no ads, no
        subscriptions. Donations go directly toward keeping it running and
        making it better.
      </p>
      <div className="grid grid-cols-3 gap-2">
        {["$5", "$10", "$25"].map((amount) => (
          <button
            key={amount}
            type="button"
            className="h-8 rounded-md border border-zinc-300 bg-white text-sm font-semibold"
          >
            {amount}
          </button>
        ))}
      </div>
      <Field label="Custom amount">
        <TextInput
          placeholder="$"
          className="h-8 min-w-0 border-transparent bg-transparent px-2 text-sm font-semibold text-zinc-950 shadow-none focus-visible:border-transparent focus-visible:bg-zinc-50 focus-visible:ring-0"
        />
      </Field>
      <ButtonPrimary type="button">Continue</ButtonPrimary>
    </ModalFrame>
  );
}
