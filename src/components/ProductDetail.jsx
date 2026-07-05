import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import { useFavoritesStore } from "../store/useFavoritesStore";
import { formatINR } from "../utils/currency";
import { StarRating } from "./ProductCard";
import { showToast } from "./Toast";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading, isError } = useProduct(id);

  const isFavorite = useFavoritesStore((state) =>
    product ? state.favoriteIds.includes(product.id) : false
  );
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  if (isLoading) {
    return (
      <section className="min-w-0 flex-1 animate-pulse">
        <div className="mb-4 h-4 w-24 rounded bg-gray-200" />
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="aspect-square rounded-xl bg-gray-200" />
          <div className="space-y-3">
            <div className="h-6 w-3/4 rounded bg-gray-200" />
            <div className="h-4 w-1/3 rounded bg-gray-200" />
            <div className="h-8 w-1/4 rounded bg-gray-200" />
          </div>
        </div>
      </section>
    );
  }

  if (isError || !product) {
    return (
      <section className="flex h-64 min-w-0 flex-1 flex-col items-center justify-center gap-3 text-gray-400">
        <p>Couldn&apos;t load this product.</p>
        <button
          onClick={() => navigate("/products")}
          className="text-sm font-medium text-pink-600 hover:underline"
        >
          ← Back to products
        </button>
      </section>
    );
  }

  return (
    <section className="min-w-0 flex-1">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-sm font-medium text-pink-600 hover:underline"
      >
        ← Back
      </button>

      <div className="grid gap-8 rounded-xl border border-gray-200 bg-white p-6 sm:grid-cols-2">
        <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs capitalize text-gray-400">{product.category}</p>
            <h1 className="text-xl font-semibold text-gray-900">{product.name}</h1>
          </div>

          <StarRating rating={product.rating} reviewCount={product.reviewCount} />

          <p className="text-2xl font-bold text-gray-900">{formatINR(product.price)}</p>

          {product.description && (
            <p className="text-sm leading-relaxed text-gray-600">{product.description}</p>
          )}

          <button
            onClick={() => {
              toggleFavorite(product.id);
              showToast(isFavorite ? "Removed from Wishlist" : "Added to Wishlist");
            }}
            className={`flex w-full items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm font-semibold transition sm:w-auto sm:px-6 ${
              isFavorite
                ? "border-pink-600 bg-pink-50 text-pink-600"
                : "border-gray-300 text-gray-700 hover:border-pink-400 hover:text-pink-600"
            }`}
          >
            <span aria-hidden="true">{isFavorite ? "♥" : "♡"}</span>
            {isFavorite ? "Saved to Wishlist" : "Add to Wishlist"}
          </button>
        </div>
      </div>
    </section>
  );
}
