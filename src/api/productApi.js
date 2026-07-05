const BASE_URL = "https://dummyjson.com";

// DummyJSON hardcodes every product's `reviews` array to exactly 3 entries,
// so it carries no real signal. A review count is instead derived
// deterministically from the product id (stable across renders/reloads)
// to show realistic, varied numbers in the UI.
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function mapProduct(p) {
  return {
    id: p.id,
    name: p.title,
    image: p.thumbnail,
    images: p.images ?? [p.thumbnail],
    description: p.description ?? "",
    price: p.price,
    category: p.category,
    rating: p.rating,
    reviewCount: Math.floor(seededRandom(p.id) * 495) + 5,
    brand: p.brand ?? "",
  };
}

export async function fetchCategories() {
  const res = await fetch(`${BASE_URL}/products/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  const data = await res.json();
  return data.map((c) => (typeof c === "string" ? c : c.slug));
}

export async function fetchProducts({ category, sortBy, order, page, limit }) {
  const skip = (page - 1) * limit;
  const params = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
  });
  if (sortBy) {
    params.set("sortBy", sortBy);
    params.set("order", order || "asc");
  }

  const url = category
    ? `${BASE_URL}/products/category/${category}?${params.toString()}`
    : `${BASE_URL}/products?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();

  return {
    products: data.products.map(mapProduct),
    total: data.total,
    limit: data.limit,
    skip: data.skip,
  };
}

export async function fetchAllProducts() {
  const res = await fetch(`${BASE_URL}/products?limit=0`);
  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();
  return data.products.map(mapProduct);
}

export async function fetchProductById(id) {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  const data = await res.json();
  return mapProduct(data);
}
