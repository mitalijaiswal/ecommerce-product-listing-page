import React, { useEffect, useState, Suspense, lazy } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Header from "./components/Header";
import FilterSidebar from "./components/FilterSidebar";
import ProductGrid from "./components/ProductGrid";
import Pagination from "./components/Pagination";
import Toolbar from "./components/Toolbar";
import { useFilterStore } from "./store/useFilterStore";
import { useProducts } from "./hooks/useProducts";
import { useDebouncedValue } from "./hooks/useDebouncedValue";
import { useUrlFilterSync } from "./hooks/useUrlFilterSync";
import { fetchProducts } from "./api/productApi";
import NotFound from "./components/NotFound";
import ToastContainer from "./components/Toast";

// Wishlist and product-detail are secondary routes (not needed for first
// paint of the product listing), so each is split into its own chunk and
// only fetched when visited.
const FavoritesView = lazy(() => import("./components/FavoritesView"));
const ProductDetail = lazy(() => import("./components/ProductDetail"));

function ShopView() {
  const department = useFilterStore((state) => state.department);
  const category = useFilterStore((state) => state.category);
  const search = useFilterStore((state) => state.search);
  const minRating = useFilterStore((state) => state.minRating);
  const sortBy = useFilterStore((state) => state.sortBy);
  const order = useFilterStore((state) => state.order);
  const page = useFilterStore((state) => state.page);
  const pageSize = useFilterStore((state) => state.pageSize);
  const setPage = useFilterStore((state) => state.setPage);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const debouncedSearch = useDebouncedValue(search, 400);
  useUrlFilterSync(debouncedSearch);
  const filters = {
    department,
    category,
    search: debouncedSearch,
    minRating,
    sortBy,
    order,
    page,
    pageSize,
  };

  const { data, isLoading, isError } = useProducts(filters);
  const products = data?.products ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Single-category browsing (no search) is server-paginated — prefetch the
  // next page in the background so clicking "Next" feels instant instead of
  // waiting on a fresh network round-trip.
  const queryClient = useQueryClient();
  const isServerPaginated = Boolean(category) && !debouncedSearch;
  useEffect(() => {
    if (!isServerPaginated || page >= totalPages) return;
    queryClient.prefetchQuery({
      queryKey: ["products", { category, sortBy, order, page: page + 1, pageSize }],
      queryFn: () => fetchProducts({ category, sortBy, order, page: page + 1, limit: pageSize }),
    });
  }, [isServerPaginated, category, sortBy, order, page, pageSize, totalPages, queryClient]);

  return (
    <>
      <FilterSidebar isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />

      <section className="min-w-0 flex-1">
        {isError ? (
          <div className="flex h-64 items-center justify-center text-red-500">
            Something went wrong while loading products.
          </div>
        ) : (
          <>
            <Toolbar
              total={total}
              search={debouncedSearch}
              onOpenFilters={() => setIsFilterOpen(true)}
            />
            <ProductGrid products={products} isLoading={isLoading} pageSize={pageSize} />
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </section>
    </>
  );
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const isFavoritesView = location.pathname === "/wishlist";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        isFavoritesView={isFavoritesView}
        onFavoritesClick={() => navigate(isFavoritesView ? "/products" : "/wishlist")}
        onLogoClick={() => navigate("/products")}
      />

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row">
        <Suspense
          fallback={
            <div className="flex h-64 flex-1 items-center justify-center text-gray-400">
              Loading…
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Navigate to="/products" replace />} />
            <Route path="/products" element={<ShopView />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route
              path="/wishlist"
              element={<FavoritesView onBack={() => navigate("/products")} />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <ToastContainer />
    </div>
  );
}
