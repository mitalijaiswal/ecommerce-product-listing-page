import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Toolbar from "../Toolbar";
import { useFilterStore } from "../../store/useFilterStore";

beforeEach(() => {
  useFilterStore.setState({
    sortBy: null,
    order: "asc",
  });
});

describe("Toolbar", () => {
  it("displays product count", () => {
    render(<Toolbar total={42} search="" onOpenFilters={() => {}} />);
    expect(screen.getByText(/Showing 42 products/)).toBeInTheDocument();
  });

  it("uses singular 'product' for count of 1", () => {
    render(<Toolbar total={1} search="" onOpenFilters={() => {}} />);
    expect(screen.getByText(/Showing 1 product\b/)).toBeInTheDocument();
  });

  it("shows search query when provided", () => {
    render(<Toolbar total={5} search="blue shirt" onOpenFilters={() => {}} />);
    expect(screen.getByText(/blue shirt/)).toBeInTheDocument();
    expect(screen.getByText(/Showing 5 products for/)).toBeInTheDocument();
  });

  it("calls onOpenFilters when Filters button is clicked", async () => {
    const user = userEvent.setup();
    const onOpenFilters = jest.fn();
    render(<Toolbar total={10} search="" onOpenFilters={onOpenFilters} />);

    await user.click(screen.getByText("Filters"));
    expect(onOpenFilters).toHaveBeenCalledTimes(1);
  });

  it("renders the SortDropdown", () => {
    render(<Toolbar total={10} search="" onOpenFilters={() => {}} />);
    expect(screen.getByText("Sort by :")).toBeInTheDocument();
  });
});
