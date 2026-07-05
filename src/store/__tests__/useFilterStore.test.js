import { useFilterStore } from "../useFilterStore";

// Reset store to defaults before each test
beforeEach(() => {
  useFilterStore.setState({
    department: null,
    category: null,
    minRating: 0,
    sortBy: null,
    order: "asc",
    page: 1,
    search: "",
  });
});

describe("useFilterStore", () => {
  it("has correct default values", () => {
    const state = useFilterStore.getState();
    expect(state.department).toBeNull();
    expect(state.category).toBeNull();
    expect(state.minRating).toBe(0);
    expect(state.sortBy).toBeNull();
    expect(state.order).toBe("asc");
    expect(state.page).toBe(1);
    expect(state.pageSize).toBe(12);
    expect(state.search).toBe("");
  });

  describe("setDepartment", () => {
    it("sets the department and resets category and page", () => {
      useFilterStore.getState().setCategory("mens-shirts");
      useFilterStore.getState().setPage(3);

      useFilterStore.getState().setDepartment("men");

      const state = useFilterStore.getState();
      expect(state.department).toBe("men");
      expect(state.category).toBeNull();
      expect(state.page).toBe(1);
    });
  });

  describe("setCategory", () => {
    it("sets category and resets page to 1", () => {
      useFilterStore.getState().setPage(5);
      useFilterStore.getState().setCategory("mens-shoes");

      const state = useFilterStore.getState();
      expect(state.category).toBe("mens-shoes");
      expect(state.page).toBe(1);
    });
  });

  describe("setMinRating", () => {
    it("sets minRating and resets page to 1", () => {
      useFilterStore.getState().setPage(3);
      useFilterStore.getState().setMinRating(4);

      const state = useFilterStore.getState();
      expect(state.minRating).toBe(4);
      expect(state.page).toBe(1);
    });
  });

  describe("setSort", () => {
    it("sets sortBy and order, resets page to 1", () => {
      useFilterStore.getState().setPage(2);
      useFilterStore.getState().setSort("price", "desc");

      const state = useFilterStore.getState();
      expect(state.sortBy).toBe("price");
      expect(state.order).toBe("desc");
      expect(state.page).toBe(1);
    });
  });

  describe("setPage", () => {
    it("sets only the page without affecting other state", () => {
      useFilterStore.getState().setDepartment("women");
      useFilterStore.getState().setMinRating(3);
      useFilterStore.getState().setPage(4);

      const state = useFilterStore.getState();
      expect(state.page).toBe(4);
      expect(state.department).toBe("women");
      expect(state.minRating).toBe(3);
    });
  });

  describe("setSearch", () => {
    it("sets search and resets page to 1", () => {
      useFilterStore.getState().setPage(5);
      useFilterStore.getState().setSearch("shirt");

      const state = useFilterStore.getState();
      expect(state.search).toBe("shirt");
      expect(state.page).toBe(1);
    });
  });

  describe("resetFilters", () => {
    it("resets all filters to default values", () => {
      useFilterStore.getState().setDepartment("men");
      useFilterStore.getState().setCategory("mens-shirts");
      useFilterStore.getState().setMinRating(4);
      useFilterStore.getState().setSort("price", "desc");
      useFilterStore.getState().setPage(3);
      useFilterStore.getState().setSearch("blue");

      useFilterStore.getState().resetFilters();

      const state = useFilterStore.getState();
      expect(state.department).toBeNull();
      expect(state.category).toBeNull();
      expect(state.minRating).toBe(0);
      expect(state.sortBy).toBeNull();
      expect(state.order).toBe("asc");
      expect(state.page).toBe(1);
      expect(state.search).toBe("");
    });
  });
});
