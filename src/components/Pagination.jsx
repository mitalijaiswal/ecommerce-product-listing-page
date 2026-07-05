import React from "react";

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <div className="flex items-center justify-center gap-1 pt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 disabled:opacity-40"
      >
        Prev
      </button>

      {pages.map((p, i) => {
        const prev = pages[i - 1];
        const showEllipsis = prev && p - prev > 1;
        return (
          <React.Fragment key={p}>
            {showEllipsis && <span className="px-1 text-gray-400">…</span>}
            <button
              onClick={() => onPageChange(p)}
              className={`h-8 w-8 rounded-lg text-sm ${
                p === page ? "bg-pink-600 text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {p}
            </button>
          </React.Fragment>
        );
      })}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
