import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FilterSidebar from "../FilterSidebar";
import { useFilterStore } from "../../store/useFilterStore";

function renderSidebar(props = {}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <FilterSidebar isOpen={false} onClose={jest.fn()} {...props} />
    </QueryClientProvider>
  );
}

beforeEach(() => {
  useFilterStore.setState({
    department: null,
    category: null,
    minRating: 0,
    sortBy: null,
    order: "asc",
    page: 1,
    search: "",
  });
});

describe("FilterSidebar", () => {
  it("renders the Filters heading", () => {
    renderSidebar();
    expect(screen.getByText("Filters")).toBeInTheDocument();
  });

  it("renders category section with All option", () => {
    renderSidebar();
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("All")).toBeInTheDocument();
  });

  it("renders rating section with Any option", () => {
    renderSidebar();
    expect(screen.getByText("Rating")).toBeInTheDocument();
    expect(screen.getByText("Any")).toBeInTheDocument();
  });

  it("renders the Reset all button", () => {
    renderSidebar();
    expect(screen.getByText("Reset all")).toBeInTheDocument();
  });

  it("resets filters when Reset all is clicked", async () => {
    const user = userEvent.setup();
    useFilterStore.setState({ minRating: 4, category: "mens-shirts" });

    renderSidebar();
    await user.click(screen.getByText("Reset all"));

    const state = useFilterStore.getState();
    expect(state.minRating).toBe(0);
    expect(state.category).toBeNull();
  });

  it("sets category in store when a category radio is clicked", async () => {
    const user = userEvent.setup();
    renderSidebar();

    // Category radios are rendered — click one of them
    const radios = screen.getAllByRole("radio");
    // The first radio is "All" for categories, then individual categories, then "Any" for ratings, etc.
    // Click the second radio (first actual category)
    await user.click(radios[1]);

    expect(useFilterStore.getState().category).toBeTruthy();
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    renderSidebar({ isOpen: true, onClose });

    await user.click(screen.getByLabelText("Close filters"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("applies dialog role when open", () => {
    renderSidebar({ isOpen: true });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("does not apply dialog role when closed", () => {
    renderSidebar({ isOpen: false });
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
