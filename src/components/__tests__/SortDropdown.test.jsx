import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SortDropdown from "../SortDropdown";
import { useFilterStore } from "../../store/useFilterStore";

beforeEach(() => {
  useFilterStore.setState({
    sortBy: null,
    order: "asc",
  });
});

describe("SortDropdown", () => {
  it("renders all sort options", () => {
    render(<SortDropdown />);
    expect(screen.getByText("Relevance")).toBeInTheDocument();
    expect(screen.getByText("Price: Low to High")).toBeInTheDocument();
    expect(screen.getByText("Price: High to Low")).toBeInTheDocument();
  });

  it("defaults to Relevance", () => {
    render(<SortDropdown />);
    const select = screen.getByRole("combobox");
    expect(select.value).toBe("");
  });

  it("updates store to price-asc on selecting Low to High", async () => {
    const user = userEvent.setup();
    render(<SortDropdown />);

    await user.selectOptions(screen.getByRole("combobox"), "price-asc");

    const state = useFilterStore.getState();
    expect(state.sortBy).toBe("price");
    expect(state.order).toBe("asc");
  });

  it("updates store to price-desc on selecting High to Low", async () => {
    const user = userEvent.setup();
    render(<SortDropdown />);

    await user.selectOptions(screen.getByRole("combobox"), "price-desc");

    const state = useFilterStore.getState();
    expect(state.sortBy).toBe("price");
    expect(state.order).toBe("desc");
  });

  it("resets sort when selecting Relevance", async () => {
    const user = userEvent.setup();
    useFilterStore.setState({ sortBy: "price", order: "desc" });
    render(<SortDropdown />);

    await user.selectOptions(screen.getByRole("combobox"), "");

    const state = useFilterStore.getState();
    expect(state.sortBy).toBeNull();
    expect(state.order).toBe("asc");
  });
});
