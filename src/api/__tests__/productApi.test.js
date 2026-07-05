import { fetchCategories, fetchProducts, fetchAllProducts, fetchProductById } from "../productApi";

// Mock global fetch
beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

const mockRawProduct = {
  id: 1,
  title: "Test Shirt",
  thumbnail: "https://example.com/thumb.jpg",
  images: ["https://example.com/img1.jpg", "https://example.com/img2.jpg"],
  description: "A nice shirt",
  price: 29.99,
  category: "mens-shirts",
  rating: 4.5,
  brand: "TestBrand",
};

describe("fetchCategories", () => {
  it("fetches and maps category slugs", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          { slug: "mens-shirts", name: "Mens Shirts" },
          { slug: "womens-dresses", name: "Womens Dresses" },
        ]),
    });

    const result = await fetchCategories();
    expect(result).toEqual(["mens-shirts", "womens-dresses"]);
    expect(global.fetch).toHaveBeenCalledWith("https://dummyjson.com/products/categories");
  });

  it("handles plain string categories", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(["beauty", "fragrances"]),
    });

    const result = await fetchCategories();
    expect(result).toEqual(["beauty", "fragrances"]);
  });

  it("throws on non-ok response", async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, status: 500 });
    await expect(fetchCategories()).rejects.toThrow("Failed to fetch categories");
  });
});

describe("fetchProducts", () => {
  it("fetches products by category with pagination and sort", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          products: [mockRawProduct],
          total: 1,
          limit: 12,
          skip: 0,
        }),
    });

    const result = await fetchProducts({
      category: "mens-shirts",
      sortBy: "price",
      order: "desc",
      page: 1,
      limit: 12,
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/products/category/mens-shirts")
    );
    expect(result.products).toHaveLength(1);
    expect(result.products[0]).toMatchObject({
      id: 1,
      name: "Test Shirt",
      price: 29.99,
      category: "mens-shirts",
    });
    expect(result.total).toBe(1);
  });

  it("fetches from base products endpoint when no category given", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({ products: [mockRawProduct], total: 1, limit: 12, skip: 0 }),
    });

    await fetchProducts({ category: null, sortBy: null, order: "asc", page: 1, limit: 12 });

    const url = global.fetch.mock.calls[0][0];
    expect(url).toContain("dummyjson.com/products?");
    expect(url).not.toContain("/category/");
  });

  it("maps raw product fields correctly", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({ products: [mockRawProduct], total: 1, limit: 12, skip: 0 }),
    });

    const result = await fetchProducts({
      category: null,
      sortBy: null,
      order: "asc",
      page: 1,
      limit: 12,
    });

    const mapped = result.products[0];
    expect(mapped.name).toBe("Test Shirt");
    expect(mapped.image).toBe("https://example.com/thumb.jpg");
    expect(mapped.images).toEqual(["https://example.com/img1.jpg", "https://example.com/img2.jpg"]);
    expect(mapped.brand).toBe("TestBrand");
    expect(mapped.description).toBe("A nice shirt");
    expect(typeof mapped.reviewCount).toBe("number");
    expect(mapped.reviewCount).toBeGreaterThanOrEqual(5);
    expect(mapped.reviewCount).toBeLessThanOrEqual(500);
  });

  it("throws on non-ok response", async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, status: 500 });
    await expect(
      fetchProducts({ category: null, sortBy: null, order: "asc", page: 1, limit: 12 })
    ).rejects.toThrow("Failed to fetch products");
  });
});

describe("fetchAllProducts", () => {
  it("fetches with limit=0 to get all products", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ products: [mockRawProduct] }),
    });

    const result = await fetchAllProducts();
    expect(global.fetch).toHaveBeenCalledWith("https://dummyjson.com/products?limit=0");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Test Shirt");
  });
});

describe("fetchProductById", () => {
  it("fetches a single product by id", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockRawProduct),
    });

    const result = await fetchProductById(1);
    expect(global.fetch).toHaveBeenCalledWith("https://dummyjson.com/products/1");
    expect(result.id).toBe(1);
    expect(result.name).toBe("Test Shirt");
  });

  it("throws on non-ok response", async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, status: 404 });
    await expect(fetchProductById(999)).rejects.toThrow("Failed to fetch product");
  });
});
