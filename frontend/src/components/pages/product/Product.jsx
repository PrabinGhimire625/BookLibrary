import React, { useState } from "react";
import Navbar from "../../globals/Navbar";
import { ShoppingCart, Bookmark } from "lucide-react";
import ComplexFilter from "../../globals/ComplexFilter";

const products = [
  {
    title: "Never Again: Testimonies from the...",
    author: "Kunda Again",
    price: 2500,
    image:
      "https://booksmandala.com/_next/image?url=https%3A%2F%2Fbooks.bizmandala.com%2Fmedia%2Fbooks%2Fb2616%2Fimage.webp&w=1920&q=75",
  },
  {
    title: "Buddhist worlds",
    author: "Sergio Ardissone",
    price: 3100,
    image:
      "https://booksmandala.com/_next/image?url=https%3A%2F%2Fbooks.bizmandala.com%2Fmedia%2Fbooks%2Fb2616%2Fimage.webp&w=1920&q=75",
  },
  {
    title: "photographing plants and gardens",
    author: "Clive Nichols",
    price: 960,
    image:
      "https://booksmandala.com/_next/image?url=https%3A%2F%2Fbooks.bizmandala.com%2Fmedia%2Fbooks%2Fb2616%2Fimage.webp&w=1920&q=75",
  },
  {
    title: "The Icelandic Voyage",
    author: "Amit Gupta",
    price: 784,
    image:
      "https://booksmandala.com/_next/image?url=https%3A%2F%2Fbooks.bizmandala.com%2Fmedia%2Fbooks%2Fb2616%2Fimage.webp&w=1920&q=75",
  },
  {
    title: "The Rough Guide to Jimi Hendrix",
    author: "Richie Unterberger",
    price: 1440,
    image:
      "https://booksmandala.com/_next/image?url=https%3A%2F%2Fbooks.bizmandala.com%2Fmedia%2Fbooks%2Fb2616%2Fimage.webp&w=1920&q=75",
  },
  {
    title: "The Rough Guide to Jimi Hendrix",
    author: "Richie Unterberger",
    price: 1440,
    image:
      "https://booksmandala.com/_next/image?url=https%3A%2F%2Fbooks.bizmandala.com%2Fmedia%2Fbooks%2Fb2616%2Fimage.webp&w=1920&q=75",
  },
  {
    title: "The Rough Guide to Jimi Hendrix",
    author: "Richie Unterberger",
    price: 1440,
    image:
      "https://booksmandala.com/_next/image?url=https%3A%2F%2Fbooks.bizmandala.com%2Fmedia%2Fbooks%2Fb2616%2Fimage.webp&w=1920&q=75",
  },
  {
    title: "The Rough Guide to Jimi Hendrix",
    author: "Richie Unterberger",
    price: 1440,
    image:
      "https://booksmandala.com/_next/image?url=https%3A%2F%2Fbooks.bizmandala.com%2Fmedia%2Fbooks%2Fb2616%2Fimage.webp&w=1920&q=75",
  },
  {
    title: "The Rough Guide to Jimi Hendrix",
    author: "Richie Unterberger",
    price: 1440,
    image:
      "https://booksmandala.com/_next/image?url=https%3A%2F%2Fbooks.bizmandala.com%2Fmedia%2Fbooks%2Fb2616%2Fimage.webp&w=1920&q=75",
  },
  {
    title: "The Rough Guide to Jimi Hendrix",
    author: "Richie Unterberger",
    price: 1440,
    image:
      "https://booksmandala.com/_next/image?url=https%3A%2F%2Fbooks.bizmandala.com%2Fmedia%2Fbooks%2Fb2616%2Fimage.webp&w=1920&q=75",
  },
];

const PRODUCTS_PER_PAGE = 9;

export default function ProductPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = products.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <Navbar />
      <div className="pt-24 p-6 bg-gradient-to-b from-sky-50 to-indigo-50 min-h-screen">
        <div className="flex gap-6">
          {/* LEFT COLUMN: Category Filter */}
          <div className="w-1/5 bg-indigo-100/30 border border-indigo-200 p-4 rounded-lg shadow-md h-fit space-y-6">
            {/* Category Filter */}
            <div>
              <h2 className="text-lg font-semibold mb-2">Filter by Category</h2>
              <select className="w-full border border-gray-300 rounded-md p-2">
                <option value="All Books">All Books</option>
                <option value="Bestsellers">Bestsellers</option>
                <option value="Award Winners">Award Winners</option>
                <option value="New Releases">New Releases</option>
                <option value="New Arrivals">New Arrivals</option>
                <option value="Coming Soon">Coming Soon</option>
                <option value="Deals">Deals</option>
              </select>
            </div>

            {/* Complex Filter */}
            <ComplexFilter />
          </div>

          {/* RIGHT COLUMN: Products */}
          <div className="w-4/5">
            <div className="flex justify-end mb-4">
              <select className="border border-gray-300 rounded-md p-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-300">
                <option value="title-desc">Title (Z–A)</option>
                <option value="date-desc">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="popularity">Most Popular</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {paginatedProducts.map((product, index) => (
                <div className="bg-white/80 border border-indigo-100 shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-md font-semibold text-indigo-900 truncate">
                      {product.title}
                    </h3>
                    <p className="text-sm text-indigo-700 mb-1">
                      by {product.author}
                    </p>
                    <p className="text-lg font-bold text-indigo-800 mb-3">
                      Rs. {product.price}
                    </p>

                    <div className="flex justify-between gap-2">
                      <button className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-md flex items-center justify-center transition-colors duration-300">
                        <ShoppingCart size={18} />
                      </button>
                      <button className="w-12 bg-white border border-indigo-300 hover:bg-indigo-100 text-indigo-600 rounded-md flex items-center justify-center transition-all duration-300">
                        <Bookmark size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            <div className="mt-8 flex justify-center items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-4 py-2 rounded ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
