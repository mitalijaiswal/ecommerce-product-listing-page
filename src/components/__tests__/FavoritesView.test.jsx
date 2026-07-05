import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FavoritesView from "../FavoritesView";
import { useFavoritesStore } from "../../store/useFavoritesStore";

jest.mock("../../utils/currency", () => ({
  formatINR: (price) => `₹${Math.round(price * 83)}`,
}));

function renderWithProviders(ui) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
}

beforeEach(() => {
  useFavoritesStore.setState({ favoriteIds: [] });
});

describe("FavoritesView", () => {
  it("shows empty state when no favorites", () => {
    renderWithProviders(<FavoritesView onBack={() => {}} />);
    expect(screen.getByText("Save your favorite items here for later.")).toBeInTheDocument();
  });

  it("shows Wishlist heading", () => {
    renderWithProviders(<FavoritesView onBack={() => {}} />);
    expect(screen.getByRole("heading", { name: "Wishlist" })).toBeInTheDocument();
  });

  it("calls onBack when Continue Shopping is clicked", async () => {
    const user = userEvent.setup();
    const onBack = jest.fn();
    renderWithProviders(<FavoritesView onBack={onBack} />);

    await user.click(screen.getByText("← Continue Shopping"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
