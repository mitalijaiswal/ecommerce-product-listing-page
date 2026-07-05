import { DEPARTMENTS, ALLOWED_CATEGORIES, getDepartmentCategories } from "../departments";

describe("DEPARTMENTS", () => {
  it("has 5 departments", () => {
    expect(DEPARTMENTS).toHaveLength(5);
  });

  it("each department has id, label, and categories array", () => {
    DEPARTMENTS.forEach((dept) => {
      expect(dept).toHaveProperty("id");
      expect(dept).toHaveProperty("label");
      expect(Array.isArray(dept.categories)).toBe(true);
      expect(dept.categories.length).toBeGreaterThan(0);
    });
  });

  it("contains expected department ids", () => {
    const ids = DEPARTMENTS.map((d) => d.id);
    expect(ids).toEqual(["men", "women", "kids", "beauty", "home"]);
  });
});

describe("ALLOWED_CATEGORIES", () => {
  it("is the flat union of all department categories", () => {
    const expected = DEPARTMENTS.flatMap((d) => d.categories);
    expect(ALLOWED_CATEGORIES).toEqual(expected);
  });

  it("contains no duplicates", () => {
    const unique = new Set(ALLOWED_CATEGORIES);
    expect(unique.size).toBe(ALLOWED_CATEGORIES.length);
  });
});

describe("getDepartmentCategories", () => {
  it("returns categories for a valid department", () => {
    expect(getDepartmentCategories("men")).toEqual(["mens-shirts", "mens-shoes", "mens-watches"]);
  });

  it("returns women's categories", () => {
    expect(getDepartmentCategories("women")).toEqual([
      "womens-dresses",
      "womens-shoes",
      "womens-bags",
      "womens-jewellery",
      "womens-watches",
    ]);
  });

  it("falls back to ALLOWED_CATEGORIES for unknown department", () => {
    expect(getDepartmentCategories("unknown")).toEqual(ALLOWED_CATEGORIES);
  });

  it("falls back to ALLOWED_CATEGORIES for null/undefined", () => {
    expect(getDepartmentCategories(null)).toEqual(ALLOWED_CATEGORIES);
    expect(getDepartmentCategories(undefined)).toEqual(ALLOWED_CATEGORIES);
  });
});
