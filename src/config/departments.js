// Curated subset of DummyJSON's ~24 raw categories, grouped into storefront
// departments. Categories outside this list (laptops, smartphones, groceries,
// vehicle, etc.) don't fit a fashion/beauty/home clone and are excluded
// everywhere: header nav, sidebar filters, and the default product listing.
export const DEPARTMENTS = [
  {
    id: "men",
    label: "Men",
    categories: ["mens-shirts", "mens-shoes", "mens-watches"],
  },
  {
    id: "women",
    label: "Women",
    categories: [
      "womens-dresses",
      "womens-shoes",
      "womens-bags",
      "womens-jewellery",
      "womens-watches",
    ],
  },
  {
    id: "kids",
    label: "Kids",
    categories: ["tops"],
  },
  {
    id: "beauty",
    label: "Beauty",
    categories: ["beauty", "fragrances", "skin-care"],
  },
  {
    id: "home",
    label: "Home & Living",
    categories: ["home-decoration", "furniture", "kitchen-accessories"],
  },
];

export const ALLOWED_CATEGORIES = DEPARTMENTS.flatMap((d) => d.categories);

export function getDepartmentCategories(departmentId) {
  return DEPARTMENTS.find((d) => d.id === departmentId)?.categories ?? ALLOWED_CATEGORIES;
}
