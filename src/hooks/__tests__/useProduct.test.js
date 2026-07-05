import { renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useProduct } from "../useProduct";
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

const mockProduct = {
  id: 1,
  name: "Test Shirt",
  image: "thumb.jpg",
  images: ["img1.jpg"],
  description: "A shirt",
  price: 20,
  category: "mens-shirts",
  rating: 4.5,
  reviewCount: 100,
  brand: "Brand",
};

describe("useProduct", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("fetches a product by id", async () => {
    api.fetchProductById.mockResolvedValueOnce(mockProduct);

    const { result } = renderHook(() => useProduct(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.data).toBeDefined());

    expect(result.current.data).toEqual(mockProduct);
    expect(api.fetchProductById).toHaveBeenCalledWith(1);
  });

  it("returns isLoading true initially", () => {
    api.fetchProductById.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useProduct(1), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
  });

  it("returns isError true on failure", async () => {
    api.fetchProductById.mockRejectedValueOnce(new Error("Not found"));

    const { result } = renderHook(() => useProduct(999), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
