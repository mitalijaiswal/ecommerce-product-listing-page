import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProductGrid from "../ProductGrid";

jest.mock("../../utils/currency", () => ({
  formatINR: (price) => `₹${Math.round(price * 83)}`,
}));

const products = [
  {
    id: 1,
    name: "Shirt A",
    image: "a.jpg",
    price: 20,
    category: "mens-shirts",
    rating: 4.0,
    reviewCount: 50,
  },
  {
    id: 2,
    name: "Shirt B",
    image: "b.jpg",
    price: 30,
    category: "mens-shirts",
    rating: 3.5,
    reviewCount: 100,
  },
];

describe("ProductGrid", () => {
  it("renders skeleton cards when loading", () => {
    const { container } = render(
      <MemoryRouter>
        <ProductGrid products={[]} isLoading={true} pageSize={4} />
      </MemoryRouter>
    );
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBe(4);
  });

  it("shows empty state when products array is empty and not loading", () => {
    render(
      <MemoryRouter>
        <ProductGrid products={[]} isLoading={false} pageSize={12} />
      </MemoryRouter>
    );
    expect(screen.getByText("No products match your filters.")).toBeInTheDocument();
  });

  it("renders product cards for each product", () => {
    render(
      <MemoryRouter>
        <ProductGrid products={products} isLoading={false} pageSize={12} />
      </MemoryRouter>
    );
    expect(screen.getByText("Shirt A")).toBeInTheDocument();
    expect(screen.getByText("Shirt B")).toBeInTheDocument();
  });
});
