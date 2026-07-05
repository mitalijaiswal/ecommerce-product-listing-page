import { useQueries } from "@tanstack/react-query";
import { fetchProductById } from "../api/productApi";

export function useFavoriteProducts(favoriteIds) {
  const results = useQueries({
    queries: favoriteIds.map((id) => ({
      queryKey: ["product", id],
      queryFn: () => fetchProductById(id),
      staleTime: 60_000,
    })),
  });

  const isLoading = results.some((r) => r.isLoading);
  const products = results.filter((r) => r.isSuccess).map((r) => r.data);

  return { products, isLoading };
}
