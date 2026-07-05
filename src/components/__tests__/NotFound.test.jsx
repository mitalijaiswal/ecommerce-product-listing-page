import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import NotFound from "../NotFound";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
  mockNavigate.mockClear();
});

describe("NotFound", () => {
  it("renders 404 heading", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("shows a descriptive message", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    expect(screen.getByText(/page you're looking for doesn't exist/)).toBeInTheDocument();
  });

  it("navigates to /products when button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    await user.click(screen.getByText("Back to Shopping"));
    expect(mockNavigate).toHaveBeenCalledWith("/products");
  });
});
