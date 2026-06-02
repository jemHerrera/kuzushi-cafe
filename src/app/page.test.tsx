import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  it("renders the Kuzushi Cafe scaffold", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        name: /track grappling progress with intention/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Journal entries")).toBeInTheDocument();
  });
});
