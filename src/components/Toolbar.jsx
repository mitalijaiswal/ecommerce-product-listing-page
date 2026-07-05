import React from "react";
import SortDropdown from "./SortDropdown";

export default function Toolbar({ total, search, onOpenFilters }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3">
      <div className="flex min-w-0 flex-wrap items-center gap-3">
        <button
          onClick={onOpenFilters}
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 lg:hidden"
        >
          <span aria-hidden="true">☰</span> Filters
        </button>
        <span className="text-sm text-gray-600">
          {search ? (
            <>
              Showing {total} {total === 1 ? "product" : "products"} for{" "}
              <span className="font-medium text-gray-900">&quot;{search}&quot;</span>
            </>
          ) : (
            <>
              Showing {total} {total === 1 ? "product" : "products"}
            </>
          )}
        </span>
      </div>
      <SortDropdown />
    </div>
  );
}
