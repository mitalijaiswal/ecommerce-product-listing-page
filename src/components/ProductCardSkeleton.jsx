import React from "react";

export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-3">
      <div className="aspect-square w-full rounded-lg bg-gray-200" />
      <div className="mt-3 space-y-2">
        <div className="h-3 w-3/4 rounded bg-gray-200" />
        <div className="h-3 w-1/2 rounded bg-gray-200" />
        <div className="h-4 w-1/3 rounded bg-gray-200" />
      </div>
    </div>
  );
}
