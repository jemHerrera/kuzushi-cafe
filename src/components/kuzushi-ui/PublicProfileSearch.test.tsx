import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PublicProfileSearch } from "./PublicProfileSearch";

describe("PublicProfileSearch", () => {
  it("opens a dedicated public profile search dialog", async () => {
    const user = userEvent.setup();

    render(<PublicProfileSearch />);

    await user.click(
      screen.getByRole("button", { name: /search public profiles/i }),
    );

    const dialog = screen.getByRole("dialog", {
      name: /search public profiles/i,
    });

    expect(dialog).toBeInTheDocument();
    expect(
      within(dialog).getByPlaceholderText(/search by name, belt, weight, or age/i),
    ).toBeInTheDocument();
  });

  it("filters profile results inside the dialog", async () => {
    const user = userEvent.setup();

    render(<PublicProfileSearch />);

    await user.click(
      screen.getByRole("button", { name: /search public profiles/i }),
    );
    await user.type(
      screen.getByPlaceholderText(/search by name, belt, weight, or age/i),
      "young adult",
    );

    const dialog = screen.getByRole("dialog", {
      name: /search public profiles/i,
    });
    expect(within(dialog).getByText(/noah reed/i)).toBeInTheDocument();
    expect(within(dialog).queryByText(/maya chen/i)).not.toBeInTheDocument();
  });
});
