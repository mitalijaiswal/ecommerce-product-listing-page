import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFavoritesStore } from "../store/useFavoritesStore";
import { useFilterStore } from "../store/useFilterStore";
import { DEPARTMENTS } from "../config/departments";

export default function Header({ isFavoritesView, onFavoritesClick, onLogoClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const favoriteCount = useFavoritesStore((state) => state.favoriteIds.length);
  const search = useFilterStore((state) => state.search);
  const setSearch = useFilterStore((state) => state.setSearch);
  const department = useFilterStore((state) => state.department);
  const setDepartment = useFilterStore((state) => state.setDepartment);

  // Update the store first, then only navigate if we're not already on the
  // listing page. useUrlFilterSync (mounted with ShopView) reflects the new
  // department into the URL on its own — calling navigate("/products") here
  // unconditionally would replace the URL with a bare, query-less path,
  // which useUrlFilterSync's URL -> store hydration effect then reads as an
  // external navigation and uses to reset the store right back to defaults,
  // undoing the setDepartment call above in the same tick. Only navigate
  // (with the department pre-filled) when coming from a different route
  // (e.g. the wishlist or a product detail page), where a fresh mount needs
  // the URL to already carry the department for hydration to pick up.
  const goToDepartment = (id) => {
    setDepartment(id);
    if (location.pathname !== "/products") {
      navigate(`/products?dept=${encodeURIComponent(id)}`);
    }
  };

  const logo = (
    <button onClick={onLogoClick} className="flex shrink-0 flex-col items-center">
      <svg width="26" height="22" viewBox="0 0 40 32" fill="none" aria-hidden="true">
        <path d="M2 2L11 2L20 17L20 26L11 13L11 30L2 30Z" fill="#ec4899" />
        <path d="M38 2L29 2L20 17L20 26L29 13L29 30L38 30Z" fill="#0f172a" />
        <circle cx="20" cy="29.5" r="2.4" fill="#ec4899" />
      </svg>
      <span className="text-base font-extrabold uppercase leading-none tracking-tight text-gray-900">
        Mivora
      </span>
    </button>
  );

  const navButtons = DEPARTMENTS.map((d) => (
    <button
      key={d.id}
      onClick={() => goToDepartment(d.id)}
      className={`whitespace-nowrap text-sm font-semibold uppercase tracking-wide transition ${
        department === d.id ? "text-pink-600" : "text-gray-800 hover:text-pink-600"
      }`}
    >
      {d.label}
    </button>
  ));

  const searchInput = (
    <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search for products, brands and more"
      className="w-full rounded-md border border-gray-200 bg-gray-100 px-4 py-2 text-sm text-gray-800 focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-400"
    />
  );

  const wishlistButton = (
    <button
      onClick={onFavoritesClick}
      className="group flex shrink-0 flex-col items-center gap-0.5 text-gray-700"
    >
      <span className="relative text-xl leading-none">
        <span
          className={isFavoritesView ? "text-pink-600" : "text-gray-700 group-hover:text-pink-600"}
        >
          {isFavoritesView ? "♥" : "♡"}
        </span>
        {favoriteCount > 0 && (
          <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-pink-600 text-[10px] font-bold text-white">
            {favoriteCount}
          </span>
        )}
      </span>
      <span
        className={`text-xs font-medium ${
          isFavoritesView ? "text-pink-600" : "group-hover:text-pink-600"
        }`}
      >
        Wishlist
      </span>
    </button>
  );

  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
        {/* Row 1 (all sizes): logo, then desktop nav+search inline, wishlist far right */}
        <div className="flex items-center gap-4 lg:gap-8">
          {logo}

          <nav className="hidden shrink-0 items-center gap-6 lg:flex">{navButtons}</nav>

          <div className="hidden flex-1 items-center lg:flex">{searchInput}</div>

          <div className="ml-auto flex items-center lg:ml-0">{wishlistButton}</div>
        </div>

        {/* Row 2 (mobile/tablet only): full-width search */}
        <div className="mt-3 lg:hidden">{searchInput}</div>

        {/* Row 3 (mobile/tablet only): horizontally scrollable department nav */}
        <nav className="mt-3 flex items-center gap-5 overflow-x-auto pb-1 lg:hidden">
          {navButtons}
        </nav>
      </div>
    </header>
  );
}
