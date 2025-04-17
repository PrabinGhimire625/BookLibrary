import React, { useState } from "react";

const FilterSection = () => {
  const [filters, setFilters] = useState({
    author: "",
    genre: "",
    availability: "",
    priceRange: "",
    ratings: "",
    language: "",
    format: "",
    publisher: "",
    search: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <div className="w-full  bg-indigo-100/30 border-indigo-200 text-gray-800 p-4 rounded-xl shadow-sm h-fit">
      <h2 className="text-lg font-semibold mb-4">Filter Books</h2>

      {/* Search Bar */}
      <input
        type="text"
        name="search"
        value={filters.search}
        onChange={handleFilterChange}
        placeholder="Search by title, ISBN, or description"
        className="w-full border border-gray-300 bg-white text-sm text-gray-700 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />

      {/* Dropdown Component */}
      {[
        { name: "author", label: "Author", options: ["Kunda Again", "Sergio Ardissone", "Clive Nichols"] },
        { name: "genre", label: "Genre", options: ["History", "Photography", "Spiritual", "Music"] },
        {
          name: "availability",
          label: "Availability",
          options: ["In Stock", "Available for Pickup", "Out of Stock"],
        },
        {
          name: "priceRange",
          label: "Price Range",
          options: ["0-500", "500-1000", "1000-2000", "2000-5000", "5000+"],
        },
        {
          name: "ratings",
          label: "Ratings",
          options: ["1", "2", "3", "4", "5"],
        },
        { name: "language", label: "Language", options: ["English", "Nepali"] },
        {
          name: "format",
          label: "Format",
          options: [
            "Paperback",
            "Hardcover",
            "Signed Edition",
            "Limited Edition",
            "First Edition",
            "Collector's Edition",
            "Deluxe Edition",
          ],
        },
        {
          name: "publisher",
          label: "Publisher",
          options: ["Publisher A", "Publisher B"],
        },
      ].map((filter) => (
        <select
          key={filter.name}
          name={filter.name}
          value={filters[filter.name]}
          onChange={handleFilterChange}
          className="w-full border border-gray-300 bg-white text-sm text-gray-700 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="">{`Select ${filter.label}`}</option>
          {filter.options.map((option) => (
            <option key={option} value={option}>
              {filter.name === "ratings" ? `${option} Star${option !== "1" ? "s" : ""}` : option}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
};

export default FilterSection;
