import React, { useEffect, useMemo, useRef } from "react";
import { useCatalog } from "../hooks/useProducts";
import { useFilterStore } from "../store/useFilterStore";
import { ALLOWED_CATEGORIES, getDepartmentCategories } from "../config/departments";

const RATING_OPTIONS = [4, 3, 2, 1];
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function FilterSidebar({ isOpen = false, onClose = () => {} }) {
  const { data: catalog = [] } = useCatalog();
  const department = useFilterStore((state) => state.department);
  const category = useFilterStore((state) => state.category);
  const minRating = useFilterStore((state) => state.minRating);
  const setCategory = useFilterStore((state) => state.setCategory);
  const setMinRating = useFilterStore((state) => state.setMinRating);
  const resetFilters = useFilterStore((state) => state.resetFilters);

  const asideRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  // Mobile/tablet drawer: trap focus inside while open, close on Escape, and
  // restore focus to whatever opened it (the "Filters" button) once closed.
  useEffect(() => {
    if (!isOpen) return undefined;

    previouslyFocusedRef.current = document.activeElement;
    const asideEl = asideRef.current;
    const focusables = asideEl ? Array.from(asideEl.querySelectorAll(FOCUSABLE_SELECTOR)) : [];
    focusables[0]?.focus();

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocusedRef.current?.focus?.();
    };
  }, [isOpen, onClose]);

  const visibleCategories = department ? getDepartmentCategories(department) : ALLOWED_CATEGORIES;

  const ratingCounts = useMemo(() => {
    const departmentScoped = catalog.filter((p) => visibleCategories.includes(p.category));
    const categoryScoped = category
      ? departmentScoped.filter((p) => p.category === category)
      : departmentScoped;
    return Object.fromEntries(
      RATING_OPTIONS.map((r) => [r, categoryScoped.filter((p) => p.rating >= r).length])
    );
  }, [catalog, visibleCategories, category]);

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        ref={asideRef}
        role={isOpen ? "dialog" : undefined}
        aria-modal={isOpen ? true : undefined}
        aria-label="Filters"
        className={`fixed inset-y-0 left-0 z-40 h-full w-72 max-w-[80vw] transform space-y-6 overflow-y-auto bg-white p-4 shadow-xl transition-transform duration-200 ease-out lg:sticky lg:top-20 lg:z-0 lg:h-fit lg:w-56 lg:max-w-none lg:translate-x-0 lg:transform-none lg:rounded-xl lg:border lg:border-gray-200 lg:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-800">Filters</h2>
          <div className="flex items-center gap-3">
            <button onClick={resetFilters} className="text-xs text-pink-600 hover:underline">
              Reset all
            </button>
            <button
              onClick={onClose}
              aria-label="Close filters"
              className="text-gray-400 hover:text-gray-600 lg:hidden"
            >
              ✕
            </button>
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase text-gray-500">Category</h3>
          <div className="space-y-1.5">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
              <input
                type="radio"
                name="category"
                checked={!category}
                onChange={() => setCategory(null)}
                className="accent-pink-600"
              />
              All
            </label>
            {visibleCategories.map((c) => (
              <label
                key={c}
                className="flex cursor-pointer items-center gap-2 text-sm capitalize text-gray-700"
              >
                <input
                  type="radio"
                  name="category"
                  checked={category === c}
                  onChange={() => setCategory(c)}
                  className="accent-pink-600"
                />
                {department
                  ? c.replace(/^(mens|womens)-/, "").replace(/-/g, " ")
                  : c
                      .replace(/^mens-/, "Men's ")
                      .replace(/^womens-/, "Women's ")
                      .replace(/-/g, " ")}
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h3 className="mb-3 text-sm font-medium text-gray-800">Rating</h3>
          <div className="space-y-3">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
              <input
                type="radio"
                name="rating"
                checked={minRating === 0}
                onChange={() => setMinRating(0)}
                className="accent-pink-600"
              />
              Any
            </label>
            {RATING_OPTIONS.map((r) => (
              <label
                key={r}
                className="flex cursor-pointer items-center gap-2 text-sm text-gray-700"
              >
                <input
                  type="radio"
                  name="rating"
                  checked={minRating === r}
                  onChange={() => setMinRating(r)}
                  className="accent-pink-600"
                />
                <span>{r}</span>
                <span className="text-amber-500">★</span>
                <span>&amp; Above</span>
                <span className="text-gray-400">({ratingCounts[r].toLocaleString()})</span>
              </label>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
