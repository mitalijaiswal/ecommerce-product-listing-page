import { useFavoritesStore } from "../useFavoritesStore";

beforeEach(() => {
  useFavoritesStore.setState({ favoriteIds: [] });
});

describe("useFavoritesStore", () => {
  it("starts with an empty favorites list", () => {
    expect(useFavoritesStore.getState().favoriteIds).toEqual([]);
  });

  describe("toggleFavorite", () => {
    it("adds a product id when not already favorited", () => {
      useFavoritesStore.getState().toggleFavorite(42);
      expect(useFavoritesStore.getState().favoriteIds).toEqual([42]);
    });

    it("removes a product id when already favorited", () => {
      useFavoritesStore.setState({ favoriteIds: [10, 20, 30] });

      useFavoritesStore.getState().toggleFavorite(20);
      expect(useFavoritesStore.getState().favoriteIds).toEqual([10, 30]);
    });

    it("toggles on then off", () => {
      useFavoritesStore.getState().toggleFavorite(5);
      expect(useFavoritesStore.getState().favoriteIds).toContain(5);

      useFavoritesStore.getState().toggleFavorite(5);
      expect(useFavoritesStore.getState().favoriteIds).not.toContain(5);
    });

    it("handles multiple favorites", () => {
      useFavoritesStore.getState().toggleFavorite(1);
      useFavoritesStore.getState().toggleFavorite(2);
      useFavoritesStore.getState().toggleFavorite(3);
      expect(useFavoritesStore.getState().favoriteIds).toEqual([1, 2, 3]);
    });
  });

  describe("isFavorite", () => {
    it("returns true for a favorited id", () => {
      useFavoritesStore.setState({ favoriteIds: [10, 20] });
      expect(useFavoritesStore.getState().isFavorite(10)).toBe(true);
    });

    it("returns false for a non-favorited id", () => {
      useFavoritesStore.setState({ favoriteIds: [10, 20] });
      expect(useFavoritesStore.getState().isFavorite(99)).toBe(false);
    });
  });
});
