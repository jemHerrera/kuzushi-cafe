import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TrainingPartnerSelectMenu } from "./TrainingPartnerSelectMenu";

describe("TrainingPartnerSelectMenu", () => {
  it("shows partner weight and age instead of belt text", async () => {
    const user = userEvent.setup();

    render(<TrainingPartnerSelectMenu />);

    await user.click(screen.getByRole("button", { name: /select partner/i }));

    const mayaOption = screen.getByRole("option", { name: /maya chen/i });
    expect(mayaOption).toHaveTextContent("middle / 30s");
    expect(mayaOption).not.toHaveTextContent("purple");
  });

  it("searches local partner options by weight and age", async () => {
    const user = userEvent.setup();

    render(<TrainingPartnerSelectMenu />);

    await user.click(screen.getByRole("button", { name: /select partner/i }));
    await user.type(screen.getByRole("combobox"), "young adult");

    const listbox = screen.getByRole("listbox");
    expect(
      within(listbox).getByRole("option", { name: /noah reed/i }),
    ).toBeInTheDocument();
    expect(
      within(listbox).queryByRole("option", { name: /maya chen/i }),
    ).not.toBeInTheDocument();
  });

  it("selects a visible training partner", async () => {
    const user = userEvent.setup();
    const onSelectPartner = vi.fn();

    render(<TrainingPartnerSelectMenu onSelectPartner={onSelectPartner} />);

    await user.click(screen.getByRole("button", { name: /select partner/i }));
    await user.click(screen.getByRole("option", { name: /sam ito/i }));

    expect(onSelectPartner).toHaveBeenCalledWith({
      firstName: "Sam",
      lastName: "Ito",
      belt: "brown",
      weight: "heavy",
      age: "40s",
      initials: "SI",
    });
    expect(
      screen.getByRole("button", { name: /sam ito/i }),
    ).toBeInTheDocument();
  });
});
