import { create } from "zustand";

const PAGE_SIZE = 12;

export const useFilterStore = create((set) => ({
  department: null,
  category: null,
  minRating: 0,
  sortBy: null,
  order: "asc",
  page: 1,
  pageSize: PAGE_SIZE,
  search: "",

  setDepartment: (department) => set({ department, category: null, page: 1 }),
  setCategory: (category) => set({ category, page: 1 }),
  setMinRating: (minRating) => set({ minRating, page: 1 }),
  setSort: (sortBy, order) => set({ sortBy, order, page: 1 }),
  setPage: (page) => set({ page }),
  setSearch: (search) => set({ search, page: 1 }),
  resetFilters: () =>
    set({
      department: null,
      category: null,
      minRating: 0,
      sortBy: null,
      order: "asc",
      page: 1,
      search: "",
    }),
}));
