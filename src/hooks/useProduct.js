import { useQuery } from "@tanstack/react-query";
import { fetchProductById } from "../api/productApi";

export function useProduct(id) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
    enabled: Boolean(id),
    staleTime: Infinity,
  });
}
