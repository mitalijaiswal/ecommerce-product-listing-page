import React from "react";
import { useFilterStore } from "../store/useFilterStore";

const OPTIONS = [
  { label: "Relevance", value: "" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

export default function SortDropdown() {
  const sortBy = useFilterStore((state) => state.sortBy);
  const order = useFilterStore((state) => state.order);
  const setSort = useFilterStore((state) => state.setSort);

  const currentValue = sortBy ? `${sortBy}-${order}` : "";

  const handleChange = (e) => {
    const value = e.target.value;
    if (!value) return setSort(null, "asc");
    const [field, dir] = value.split("-");
    setSort(field, dir);
  };

  return (
    <div className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600">
      <span className="whitespace-nowrap">Sort by :</span>
      <select
        value={currentValue}
        onChange={handleChange}
        className="bg-transparent font-semibold text-gray-900 focus:outline-none"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
