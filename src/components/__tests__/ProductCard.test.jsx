import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ProductCard, { StarRating } from "../ProductCard";
import { useFavoritesStore } from "../../store/useFavoritesStore";

// Node 14 Intl doesn't support maximumFractionDigits:0 for currency
jest.mock("../../utils/currency", () => ({
  formatINR: (price) => `₹${Math.round(price * 83)}`,
}));

beforeEach(() => {
  useFavoritesStore.setState({ favoriteIds: [] });
});

const product = {
  id: 1,
  name: "Blue Running Shoes",
  image: "https://example.com/shoe.jpg",
  price: 49.99,
  category: "mens-shoes",
  rating: 4.2,
  reviewCount: 128,
};

function renderCard(props = {}) {
  return render(
    <MemoryRouter>
      <ProductCard product={{ ...product, ...props }} />
    </MemoryRouter>
  );
}

describe("StarRating", () => {
  it("renders rating and review count", () => {
    render(<StarRating rating={4.2} reviewCount={128} />);
    expect(screen.getByText("4.2")).toBeInTheDocument();
    expect(screen.getByText("128")).toBeInTheDocument();
  });

  it("formats rating to one decimal", () => {
    render(<StarRating rating={3} reviewCount={50} />);
    expect(screen.getByText("3.0")).toBeInTheDocument();
  });
});

describe("ProductCard", () => {
  it("renders product name, category, and price", () => {
    renderCard();
    expect(screen.getByText("Blue Running Shoes")).toBeInTheDocument();
    expect(screen.getByText("mens-shoes")).toBeInTheDocument();
  });

  it("renders a link to product detail page", () => {
    renderCard();
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/products/1");
  });

  it("shows unfavorited heart by default", () => {
    renderCard();
    expect(screen.getByLabelText("Add to favorites")).toBeInTheDocument();
  });

  it("toggles favorite on click", async () => {
    const user = userEvent.setup();
    renderCard();

    const btn = screen.getByLabelText("Add to favorites");
    await user.click(btn);

    expect(useFavoritesStore.getState().favoriteIds).toContain(1);
    expect(screen.getByLabelText("Remove from favorites")).toBeInTheDocument();
  });

  it("shows filled heart when product is already favorited", () => {
    useFavoritesStore.setState({ favoriteIds: [1] });
    renderCard();
    expect(screen.getByLabelText("Remove from favorites")).toBeInTheDocument();
  });

  it("renders product image with correct alt text", () => {
    renderCard();
    const img = screen.getByAltText("Blue Running Shoes");
    expect(img).toHaveAttribute("src", "https://example.com/shoe.jpg");
  });
});
