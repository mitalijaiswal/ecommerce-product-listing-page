import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useFilterStore } from "../store/useFilterStore";

const KEYS = {
  department: "dept",
  category: "cat",
  minRating: "rating",
  sortBy: "sort",
  order: "order",
  page: "page",
  search: "q",
};

function buildParams({ department, category, minRating, sortBy, order, page, search }) {
  const params = new URLSearchParams();
  if (department) params.set(KEYS.department, department);
  if (category) params.set(KEYS.category, category);
  if (minRating) params.set(KEYS.minRating, String(minRating));
  if (sortBy) {
    params.set(KEYS.sortBy, sortBy);
    if (order && order !== "asc") params.set(KEYS.order, order);
  }
  if (page > 1) params.set(KEYS.page, String(page));
  if (search) params.set(KEYS.search, search);
  return params;
}

/**
 * Keeps the product-listing filters (department, category, rating, sort,
 * page, search) in sync with the URL query string, so a filtered view can be
 * refreshed, bookmarked, or shared as a link, and the browser back/forward
 * buttons move between filter states — without spamming history on every
 * keystroke (search is synced using its already-debounced value).
 */
export function useUrlFilterSync(debouncedSearch) {
  const [searchParams, setSearchParams] = useSearchParams();
  const skipNextUrlRead = useRef(false);
  // On mount, the store still holds its default values for one render (the
  // URL -> store effect below hasn't committed yet), so the store -> URL
  // effect must not run with those stale defaults or it will stomp a
  // bookmarked/shared URL's query string with an empty one. Skip its very
  // first run; every run after that reflects real, hydrated store state.
  const isFirstRun = useRef(true);

  const department = useFilterStore((s) => s.department);
  const category = useFilterStore((s) => s.category);
  const minRating = useFilterStore((s) => s.minRating);
  const sortBy = useFilterStore((s) => s.sortBy);
  const order = useFilterStore((s) => s.order);
  const page = useFilterStore((s) => s.page);

  // URL -> store: runs on first load (shared/bookmarked link) and whenever the
  // URL changes from outside our own writes below (e.g. back/forward button).
  useEffect(() => {
    if (skipNextUrlRead.current) {
      skipNextUrlRead.current = false;
      return;
    }
    useFilterStore.setState({
      department: searchParams.get(KEYS.department) || null,
      category: searchParams.get(KEYS.category) || null,
      minRating: Number(searchParams.get(KEYS.minRating)) || 0,
      sortBy: searchParams.get(KEYS.sortBy) || null,
      order: searchParams.get(KEYS.order) || "asc",
      page: Number(searchParams.get(KEYS.page)) || 1,
      search: searchParams.get(KEYS.search) || "",
    });
  }, [searchParams]);

  // store -> URL: whenever filters change, reflect them in the URL (replacing,
  // not pushing, so every filter tweak doesn't create a new history entry).
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    const next = buildParams({
      department,
      category,
      minRating,
      sortBy,
      order,
      page,
      search: debouncedSearch,
    });
    const nextString = next.toString();
    if (nextString !== searchParams.toString()) {
      skipNextUrlRead.current = true;
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [department, category, minRating, sortBy, order, page, debouncedSearch]);
}
