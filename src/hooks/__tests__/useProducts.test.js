import { renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useProducts, useCategories } from "../useProducts";
import * as api from "../../api/productApi";

jest.mock("../../api/productApi");

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

const mockProducts = [
  {
    id: 1,
    name: "Shirt A",
    image: "a.jpg",
    images: ["a.jpg"],
    price: 20,
    category: "mens-shirts",
    rating: 4.5,
    reviewCount: 50,
    brand: "X",
    description: "",
  },
  {
    id: 2,
    name: "Dress B",
    image: "b.jpg",
    images: ["b.jpg"],
    price: 40,
    category: "womens-dresses",
    rating: 3.2,
    reviewCount: 30,
    brand: "Y",
    description: "",
  },
];

afterEach(() => {
  jest.resetAllMocks();
});

describe("useCategories", () => {
  it("fetches categories", async () => {
    api.fetchCategories.mockResolvedValueOnce(["mens-shirts", "womens-dresses"]);

    const { result } = renderHook(() => useCategories(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result.current.data).toEqual(["mens-shirts", "womens-dresses"]);
  });
});

describe("useProducts", () => {
  it("uses server query when category is set and no search", async () => {
    api.fetchProducts.mockResolvedValueOnce({
      products: [mockProducts[0]],
      total: 1,
      limit: 12,
      skip: 0,
    });

    const { result } = renderHook(
      () =>
        useProducts({
          department: null,
          category: "mens-shirts",
          search: "",
          minRating: 0,
          sortBy: null,
          order: "asc",
          page: 1,
          pageSize: 12,
        }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.data?.products).toBeDefined());
    expect(result.current.data.products).toHaveLength(1);
    expect(api.fetchProducts).toHaveBeenCalled();
  });

  it("uses client-side filtering when no category is set", async () => {
    api.fetchAllProducts.mockResolvedValueOnce(mockProducts);

    const { result } = renderHook(
      () =>
        useProducts({
          department: "men",
          category: null,
          search: "",
          minRating: 0,
          sortBy: null,
          order: "asc",
          page: 1,
          pageSize: 12,
        }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.data).not.toBeNull();
      expect(result.current.data.products.length).toBeGreaterThan(0);
    });
    // Only mens-shirts belongs to department "men"
    expect(result.current.data.products).toHaveLength(1);
    expect(result.current.data.products[0].category).toBe("mens-shirts");
  });

  it("uses client-side filtering when searching", async () => {
    api.fetchAllProducts.mockResolvedValueOnce(mockProducts);

    const { result } = renderHook(
      () =>
        useProducts({
          department: null,
          category: null,
          search: "Shirt",
          minRating: 0,
          sortBy: null,
          order: "asc",
          page: 1,
          pageSize: 12,
        }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.data).not.toBeNull();
      expect(result.current.data.products.length).toBeGreaterThan(0);
    });
    expect(result.current.data.products).toHaveLength(1);
    expect(result.current.data.products[0].name).toBe("Shirt A");
  });

  it("filters by minRating on client side", async () => {
    api.fetchAllProducts.mockResolvedValueOnce(mockProducts);

    const { result } = renderHook(
      () =>
        useProducts({
          department: null,
          category: null,
          search: "",
          minRating: 4,
          sortBy: null,
          order: "asc",
          page: 1,
          pageSize: 12,
        }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.data).not.toBeNull();
      expect(result.current.data.products.length).toBeGreaterThan(0);
    });
    expect(result.current.data.products).toHaveLength(1);
    expect(result.current.data.products[0].rating).toBeGreaterThanOrEqual(4);
  });

  it("sorts by price descending on client side", async () => {
    api.fetchAllProducts.mockResolvedValueOnce(mockProducts);

    const { result } = renderHook(
      () =>
        useProducts({
          department: null,
          category: null,
          search: "",
          minRating: 0,
          sortBy: "price",
          order: "desc",
          page: 1,
          pageSize: 12,
        }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.data).not.toBeNull();
      expect(result.current.data.products.length).toBeGreaterThan(0);
    });
    const prices = result.current.data.products.map((p) => p.price);
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });
});
