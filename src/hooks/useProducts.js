import { useMemo } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchProducts, fetchCategories, fetchAllProducts } from "../api/productApi";
import { ALLOWED_CATEGORIES, getDepartmentCategories } from "../config/departments";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: Infinity,
  });
}

// DummyJSON's /products/search endpoint only matches title+description text
// (not category/tags) and misses obvious singular/plural cases, so search is
// done client-side over the full catalog instead, fetched once and cached.
function useAllProducts(enabled) {
  return useQuery({
    queryKey: ["all-products"],
    queryFn: fetchAllProducts,
    staleTime: Infinity,
    enabled,
  });
}

// Shared with FilterSidebar to compute per-rating result counts; same query key
// as useAllProducts above, so React Query dedupes the underlying fetch.
export function useCatalog() {
  return useAllProducts(true);
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Word-boundary prefix match (not a plain substring match) so a query like "top"
// matches "Tops" or "Table" as a whole word but not the "top" inside "laptop".
function matchesSearch(text, words) {
  return words.every((word) => new RegExp(`\\b${escapeRegExp(word)}`, "i").test(text));
}

export function useProducts({
  department,
  category,
  search,
  minRating,
  sortBy,
  order,
  page,
  pageSize,
}) {
  const trimmedSearch = search?.trim().toLowerCase();
  const isSearching = Boolean(trimmedSearch);
  const searchWords = useMemo(
    () => (trimmedSearch ? trimmedSearch.split(/\s+/) : []),
    [trimmedSearch]
  );

  // A single product `category` maps 1:1 to DummyJSON's per-category endpoint,
  // so that case can stay server-paginated. Every other case (browsing a whole
  // department, searching, or the curated "All" view) spans multiple raw
  // categories or needs the excluded-category curation, neither of which the
  // server API can do — so those fall back to filtering the cached full catalog.
  const isClientFiltered = isSearching || !category;

  const serverQuery = useQuery({
    queryKey: ["products", { category, sortBy, order, page, pageSize }],
    queryFn: () => fetchProducts({ category, sortBy, order, page, limit: pageSize }),
    placeholderData: keepPreviousData,
    enabled: !isClientFiltered,
    select: (data) => {
      if (!minRating) return data;
      return {
        ...data,
        products: data.products.filter((p) => p.rating >= minRating),
      };
    },
  });

  const allProductsQuery = useAllProducts(isClientFiltered);

  const clientResult = useMemo(() => {
    if (!isClientFiltered || !allProductsQuery.data) return null;

    const allowedCategories = department ? getDepartmentCategories(department) : ALLOWED_CATEGORIES;

    const matches = allProductsQuery.data.filter((p) => {
      if (!allowedCategories.includes(p.category)) return false;
      if (category && p.category !== category) return false;
      if (minRating && p.rating < minRating) return false;
      if (isSearching) return matchesSearch(`${p.name} ${p.category} ${p.brand}`, searchWords);
      return true;
    });

    if (sortBy === "price") {
      matches.sort((a, b) => (order === "desc" ? b.price - a.price : a.price - b.price));
    }

    const start = (page - 1) * pageSize;
    return {
      products: matches.slice(start, start + pageSize),
      total: matches.length,
    };
  }, [
    isClientFiltered,
    allProductsQuery.data,
    department,
    category,
    minRating,
    isSearching,
    searchWords,
    sortBy,
    order,
    page,
    pageSize,
  ]);

  if (isClientFiltered) {
    return {
      data: clientResult,
      isLoading: allProductsQuery.isLoading,
      isError: allProductsQuery.isError,
    };
  }

  return serverQuery;
}
