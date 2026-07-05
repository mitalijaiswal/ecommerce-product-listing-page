# Mivora — E-Commerce Product Listing Page

A responsive product listing page built to mirror real e-commerce UX (Myntra-style), with department/category navigation, search, rating filters, price sorting, a persistent wishlist, and pagination.


## Tech Stack

- **React 18** (JavaScript)
- **React Router v6** — routing (`/products`, `/wishlist`)
- **Parcel** — zero-config bundler
- **Zustand** — client state (filters, sort, pagination, favorites)
- **TanStack React Query** — server state (fetching, caching, loading/error states, prefetching)
- **Tailwind CSS** — styling
- **[DummyJSON](https://dummyjson.com/products)** — mock product REST API

## Features

- Product grid with image, name, price, category, rating, and review count
- **Product detail page** (`/products/:id`) with full-size image, description, rating, and wishlist toggle; navigable from any product card with a back button
- Department navigation (Men / Women / Kids / Beauty / Home & Living) with a curated category filter scoped to each department
- Debounced search across the catalog (word-boundary matching, e.g. "top" matches "Tops" but not "laptop")
- Filter by category and minimum rating, with live result counts next to each rating option
- Sort by price (ascending/descending)
- **URL filter sync** — all filter/sort/page/search state is reflected in the URL query string (`?dept=men&cat=mens-shoes&rating=4&sort=price&order=desc&page=2&q=blue`), so filtered views can be bookmarked, shared as links, and navigated with the browser back/forward buttons
- Add/remove favorites (dedicated `/wishlist` page), visually highlighted, persisted to `localStorage`
- Numbered pagination (12 products per page)
- Fully responsive layout: pinned sidebar on desktop, collapses into a slide-in filter drawer on tablet/mobile; header collapses from a single row into a stacked, scrollable-nav layout below the `lg` breakpoint
- **Focus trap and Escape-to-close** on the mobile filter drawer, with focus restored to the trigger button on close
- Lazy-loaded images, loading skeletons, `memo()`-ed product cards, code-split wishlist route, and background prefetching of the next page

## Architecture Notes

- **Server state vs. client state**: React Query owns product/category data (fetching, caching, retries, prefetching); Zustand owns UI state (selected filters, sort, page, favorites). This avoids dumping everything into one component's `useState` and keeps re-renders scoped.
- **API layer abstraction** (`src/api/productApi.js`): raw DummyJSON responses are normalized to a lean UI model (`{ id, name, image, price, category, rating, reviewCount, brand }`) before touching components, so the UI isn't coupled to the backend's raw shape.
- **Server-paginated vs. client-filtered browsing** (`src/hooks/useProducts.js`): browsing a single category (no search) is fetched and sorted server-side via DummyJSON's native query params, one page at a time. Every other case — searching, browsing a whole department, or the curated "All" view — filters/sorts the full catalog client-side (fetched once, cached with `staleTime: Infinity`), since DummyJSON's endpoints can't express department curation or free-text search across categories.
- **Category curation** (`src/config/departments.js`): departments map to a hand-picked allow-list of DummyJSON categories (e.g. only relevant categories show under "Beauty"), rather than exposing every raw category DummyJSON returns.
- **Pagination over infinite scroll**: chosen to mirror how large-scale e-commerce sites (Myntra, Amazon, Flipkart) actually handle listing pages — bounded DOM size and crawlable/bookmarkable page state, rather than an unbounded feed.
- **Favorites persistence**: Zustand's `persist` middleware syncs the favorites list to `localStorage` automatically, no manual `useEffect` sync required.
- **Responsive filter drawer** (`src/components/FilterSidebar.jsx`): the same component renders as a static pinned sidebar on desktop (`lg:sticky`) and as an off-canvas drawer with a backdrop below that breakpoint, toggled from a "Filters" button in the toolbar — avoiding a duplicate mobile-only filter component.
- **Code splitting**: the `/wishlist` and `/products/:id` routes are loaded via `React.lazy` + `Suspense`, so their code isn't included in the initial `/products` bundle.
- **Bidirectional URL ↔ store sync** (`src/hooks/useUrlFilterSync.js`): a pair of `useEffect` hooks keep the Zustand filter store and the URL query string in lockstep — one hydrates the store from the URL on load/back-forward navigation, the other writes store changes back to the URL (replacing, not pushing, to avoid polluting history).

## Getting Started

```bash
npm install
npm start
```

Runs the dev server at `http://localhost:1234`.

```bash
npm run build
```

Builds a production bundle to `dist/`.

## Testing

Tests use **Jest 29** + **React Testing Library** (17 suites, 106 tests).

```bash
npm test              # run all tests
npm run test:watch    # re-run on file changes
npm run test:coverage # generate coverage report
```

### What's tested

| Layer | Suites | Coverage |
|-------|--------|----------|
| **Utils** | `currency.test.js` | INR conversion, formatting, purity |
| **Config** | `departments.test.js` | Department structure, category mapping, fallback |
| **Stores** | `useFilterStore.test.js`, `useFavoritesStore.test.js` | All setters, page-reset side effects, toggle/isFavorite |
| **API** | `productApi.test.js` | All fetch functions with mocked `global.fetch`, field mapping, error handling |
| **Hooks** | `useDebouncedValue.test.js`, `useProduct.test.js`, `useProducts.test.js`, `useFavoriteProducts.test.js` | Debounce timing, server vs client query paths, department/search/rating filtering, price sorting, loading/error states |
| **Components** | `ProductCard`, `Pagination`, `ProductGrid`, `Toolbar`, `SortDropdown`, `Header`, `FilterSidebar`, `FavoritesView` | Rendering, user interactions (clicks, typing, select), store integration, accessibility (aria labels, dialog role), empty/loading states |

## Linting & Formatting

```bash
npm run lint          # ESLint (flat config, eslint.config.mjs)
npm run format        # Prettier
```

ESLint 9 flat config with `eslint-plugin-react`, `eslint-plugin-react-hooks`, and `eslint-config-prettier`. Jest globals are scoped to test files only.

## Folder Structure

```
src/
├── api/
│   └── productApi.js          # DummyJSON fetch functions; normalizes raw API → UI model
├── components/
│   ├── __tests__/             # Jest + RTL unit tests for all components
│   │   ├── FilterSidebar.test.jsx
│   │   ├── FavoritesView.test.jsx
│   │   ├── Header.test.jsx
│   │   ├── NotFound.test.jsx
│   │   ├── Pagination.test.jsx
│   │   ├── ProductCard.test.jsx
│   │   ├── ProductGrid.test.jsx
│   │   ├── SortDropdown.test.jsx
│   │   ├── Toast.test.jsx
│   │   └── Toolbar.test.jsx
│   ├── FilterSidebar.jsx      # Category + rating filters; desktop sidebar / mobile drawer
│   ├── FavoritesView.jsx      # /wishlist route — grid of saved products
│   ├── Header.jsx             # Top nav with department tabs + search bar
│   ├── NotFound.jsx           # 404 fallback page
│   ├── Pagination.jsx         # Numbered page controls
│   ├── ProductCard.jsx        # Single product tile with wishlist toggle + toast
│   ├── ProductDetail.jsx      # /products/:id full-screen detail view
│   ├── ProductGrid.jsx        # Grid layout + loading skeletons + empty state
│   ├── SortDropdown.jsx       # Price sort select connected to Zustand
│   ├── Toast.jsx              # Singleton toast container (showToast helper)
│   └── Toolbar.jsx            # Result count + Filters button + SortDropdown
├── config/
│   └── departments.js         # Department → category allow-list mapping
├── hooks/
│   ├── useDebouncedValue.js   # Generic debounce hook
│   ├── useFavoriteProducts.js # Derives favorite product objects from store IDs
│   ├── useProducts.js         # Server vs. client query routing; filtering + sorting logic
│   └── useUrlFilterSync.js    # Bidirectional URL ↔ Zustand store sync
├── store/
│   ├── useFavoritesStore.js   # Persisted favorites set (localStorage via Zustand persist)
│   └── useFilterStore.js      # Dept / category / rating / sort / page / search state
├── utils/
│   └── currency.js            # formatINR — USD → INR conversion + locale formatting
├── __mocks__/
│   └── fileMock.js            # Static asset stub for Jest
├── App.jsx                    # Route definitions + layout shell
├── index.jsx                  # React root mount
└── setupTests.js              # jest-dom matchers + Intl.NumberFormat polyfill
```

## Requirements

- Node.js 18+ (developed and tested on Node 20)
