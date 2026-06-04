import { ButtonPrimary } from "./ButtonPrimary";
import { ModalFrame } from "./ModalFrame";
import { Field, TextInput } from "./shared";

export function DonationModal() {
  return (
    <ModalFrame title="Support Kuzushi Cafe">
      <p className="text-sm text-zinc-600">Choose an amount and continue to Stripe Checkout.</p>
      <div className="grid grid-cols-3 gap-2">
        {["$5", "$10", "$25"].map((amount) => (
          <button key={amount} className="h-10 rounded-md border border-zinc-300 bg-white text-sm font-semibold">
            {amount}
          </button>
        ))}
      </div>
      <Field label="Custom amount">
        <TextInput placeholder="$" />
      </Field>
      <ButtonPrimary>Continue to checkout</ButtonPrimary>
    </ModalFrame>
  );
}
