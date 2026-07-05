import React from "react";
import { useFavoritesStore } from "../store/useFavoritesStore";
import { useFavoriteProducts } from "../hooks/useFavoriteProducts";
import ProductGrid from "./ProductGrid";

export default function FavoritesView({ onBack }) {
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const { products, isLoading } = useFavoriteProducts(favoriteIds);

  return (
    <section className="flex-1">
      <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-900">Wishlist</h2>
        <button onClick={onBack} className="text-sm font-medium text-pink-600 hover:underline">
          ← Continue Shopping
        </button>
      </div>

      {!favoriteIds.length ? (
        <div className="flex h-96 flex-col items-center justify-center gap-3">
          <span className="text-5xl text-gray-300">♡</span>
          <p className="text-lg font-semibold text-gray-800">Wishlist</p>
          <p className="text-sm text-gray-400">Save your favorite items here for later.</p>
        </div>
      ) : (
        <ProductGrid products={products} isLoading={isLoading} pageSize={favoriteIds.length} />
      )}
    </section>
  );
}
