import React, { memo } from "react";
import { Link } from "react-router-dom";
import { useFavoritesStore } from "../store/useFavoritesStore";
import { formatINR } from "../utils/currency";
import { showToast } from "./Toast";

export function StarRating({ rating, reviewCount }) {
  return (
    <div className="inline-flex items-center gap-1 rounded border border-gray-200 bg-gray-100 px-1.5 py-0.5 text-xs font-semibold text-gray-700">
      <span>{rating.toFixed(1)}</span>
      <span className="text-green-600">★</span>
      <span className="text-gray-400">|</span>
      <span>{reviewCount}</span>
    </div>
  );
}

function ProductCard({ product }) {
  const isFavorite = useFavoritesStore((state) => state.favoriteIds.includes(product.id));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  return (
    <div className="group relative rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition hover:shadow-md">
      <button
        onClick={() => {
          toggleFavorite(product.id);
          showToast(isFavorite ? "Removed from Wishlist" : "Added to Wishlist");
        }}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow transition hover:scale-110"
      >
        <span className={isFavorite ? "text-pink-600" : "text-gray-400"}>
          {isFavorite ? "♥" : "♡"}
        </span>
      </button>

      <Link to={`/products/${product.id}`} className="block">
        <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-200 group-hover:scale-105"
          />
        </div>

        <div className="mt-3 space-y-1">
          <p className="line-clamp-2 text-sm font-medium text-gray-800">{product.name}</p>
          <p className="text-xs capitalize text-gray-400">{product.category}</p>
          <div className="flex items-center justify-between pt-1">
            <span className="text-base font-semibold text-gray-900">
              {formatINR(product.price)}
            </span>
            <StarRating rating={product.rating} reviewCount={product.reviewCount} />
          </div>
        </div>
      </Link>
    </div>
  );
}

export default memo(ProductCard);
