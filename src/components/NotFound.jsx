import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <section className="flex min-w-0 flex-1 flex-col items-center justify-center gap-4 py-20 text-center">
      <span className="text-6xl">🛍️</span>
      <h1 className="text-4xl font-bold text-gray-900">404</h1>
      <p className="text-lg text-gray-500">
        Oops! The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <button
        onClick={() => navigate("/products")}
        className="mt-2 rounded-md bg-pink-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-700"
      >
        Back to Shopping
      </button>
    </section>
  );
}
