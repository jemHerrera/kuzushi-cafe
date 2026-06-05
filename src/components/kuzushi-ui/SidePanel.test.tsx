import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SidePanel } from "./SidePanel";

describe("SidePanel", () => {
  it("opens the training partners list from the navigation", async () => {
    const user = userEvent.setup();

    render(<SidePanel />);

    await user.click(
      screen.getByRole("button", { name: /^training partners$/i }),
    );

    const dialog = screen.getByRole("dialog", { name: /training partners/i });

    expect(dialog).toBeInTheDocument();
    expect(
      within(dialog).getByPlaceholderText(
        /search by first name, last name, weight, or age/i,
      ),
    ).toBeInTheDocument();
    expect(within(dialog).getByText(/middle \/ 30s/i)).toBeInTheDocument();
    expect(within(dialog).queryByText(/purple belt/i)).not.toBeInTheDocument();
    expect(
      within(dialog).queryByRole("button", { name: /remove maya chen/i }),
    ).not.toBeInTheDocument();
  });

  it("opens a training partner public profile from the list", async () => {
    const user = userEvent.setup();

    render(<SidePanel />);

    await user.click(
      screen.getByRole("button", { name: /^training partners$/i }),
    );
    await user.click(screen.getByRole("button", { name: /noah reed/i }));

    const dialog = screen.getByRole("dialog", { name: /public profile/i });

    expect(dialog).toBeInTheDocument();
    expect(
      within(dialog).getByRole("heading", { name: /noah reed/i }),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByText(/light \/ young adult/i),
    ).toBeInTheDocument();
  });

  it("opens the custom training partner form from the list", async () => {
    const user = userEvent.setup();

    render(<SidePanel />);

    await user.click(
      screen.getByRole("button", { name: /^training partners$/i }),
    );
    await user.click(
      screen.getByRole("button", { name: /add custom training partner/i }),
    );

    const dialog = screen.getByRole("dialog", { name: /add custom partner/i });

    expect(dialog).toBeInTheDocument();
    expect(
      within(dialog).getByRole("button", { name: /back/i }),
    ).toBeInTheDocument();
  });
});
