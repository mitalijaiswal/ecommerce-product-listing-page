import { renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFavoriteProducts } from "../useFavoriteProducts";
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

const mockProduct = (id) => ({
  id,
  name: `Product ${id}`,
  image: `${id}.jpg`,
  images: [`${id}.jpg`],
  price: id * 10,
  category: "mens-shirts",
  rating: 4.0,
  reviewCount: 50,
  brand: "Brand",
  description: "",
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("useFavoriteProducts", () => {
  it("returns empty products for empty favoriteIds", async () => {
    const { result } = renderHook(() => useFavoriteProducts([]), {
      wrapper: createWrapper(),
    });

    expect(result.current.products).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it("fetches and returns products for given ids", async () => {
    api.fetchProductById
      .mockResolvedValueOnce(mockProduct(1))
      .mockResolvedValueOnce(mockProduct(5));

    const { result } = renderHook(() => useFavoriteProducts([1, 5]), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.products).toHaveLength(2));

    expect(result.current.products[0].id).toBe(1);
    expect(result.current.products[1].id).toBe(5);
    expect(result.current.isLoading).toBe(false);
  });

  it("is loading while fetching", () => {
    api.fetchProductById.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useFavoriteProducts([1]), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
  });
});
