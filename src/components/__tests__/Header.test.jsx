import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Header from "../Header";
import { useFilterStore } from "../../store/useFilterStore";
import { useFavoritesStore } from "../../store/useFavoritesStore";

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
  useFavoritesStore.setState({ favoriteIds: [] });
});

function renderHeader(props = {}) {
  const defaults = {
    isFavoritesView: false,
    onFavoritesClick: jest.fn(),
    onLogoClick: jest.fn(),
  };
  return render(
    <MemoryRouter initialEntries={["/products"]}>
      <Header {...defaults} {...props} />
    </MemoryRouter>
  );
}

describe("Header", () => {
  it("renders the Mivora brand name", () => {
    renderHeader();
    expect(screen.getByText("Mivora")).toBeInTheDocument();
  });

  it("renders all department navigation buttons", () => {
    renderHeader();
    expect(screen.getAllByText("Men")).toHaveLength(2); // desktop + mobile nav
    expect(screen.getAllByText("Women")).toHaveLength(2);
    expect(screen.getAllByText("Kids")).toHaveLength(2);
    expect(screen.getAllByText("Beauty")).toHaveLength(2);
    expect(screen.getAllByText("Home & Living")).toHaveLength(2);
  });

  it("renders the search input", () => {
    renderHeader();
    const inputs = screen.getAllByPlaceholderText("Search for products, brands and more");
    expect(inputs.length).toBeGreaterThan(0);
  });

  it("renders wishlist button with heart icon", () => {
    renderHeader();
    expect(screen.getByText("Wishlist")).toBeInTheDocument();
  });

  it("shows favorite count badge when there are favorites", () => {
    useFavoritesStore.setState({ favoriteIds: [1, 2, 3] });
    renderHeader();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("calls onFavoritesClick when wishlist button is clicked", async () => {
    const user = userEvent.setup();
    const onFavoritesClick = jest.fn();
    renderHeader({ onFavoritesClick });

    await user.click(screen.getByText("Wishlist"));
    expect(onFavoritesClick).toHaveBeenCalledTimes(1);
  });

  it("calls onLogoClick when logo is clicked", async () => {
    const user = userEvent.setup();
    const onLogoClick = jest.fn();
    renderHeader({ onLogoClick });

    await user.click(screen.getByText("Mivora"));
    expect(onLogoClick).toHaveBeenCalledTimes(1);
  });

  it("updates search store on typing in search input", async () => {
    const user = userEvent.setup();
    renderHeader();

    const inputs = screen.getAllByPlaceholderText("Search for products, brands and more");
    await user.type(inputs[0], "shoes");

    expect(useFilterStore.getState().search).toBe("shoes");
  });

  it("sets department in store when department button is clicked", async () => {
    const user = userEvent.setup();
    renderHeader();

    const menButtons = screen.getAllByText("Men");
    await user.click(menButtons[0]);

    expect(useFilterStore.getState().department).toBe("men");
  });
});
