import React, { useEffect, useState } from "react";
import Navbar from "../../globals/Navbar";
import { ShoppingCart, Bookmark } from "lucide-react";
import ComplexFilter from "../../globals/ComplexFilter";
import { listAllBook } from "../../store/bookSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const PRODUCTS_PER_PAGE = 9;

export default function ProductPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, book } = useSelector((state) => state.book);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(listAllBook());
  }, [dispatch]);

  const totalPages = Math.ceil((book?.length || 0) / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedBooks = book?.slice(startIndex, startIndex + PRODUCTS_PER_PAGE) || [];

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

          {/* RIGHT COLUMN: Books */}
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

            {status === "loading" ? (
              <div className="text-center py-20 text-xl font-semibold text-gray-600">
                Loading books...
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {paginatedBooks.map((product, index) => (
                  <Link to={`/singleBook/${product.id}`} key={index}>
                    <div className="bg-white/90 border border-indigo-100 shadow-lg rounded-xl overflow-hidden transform hover:scale-105 hover:shadow-2xl transition-transform duration-300 ease-in-out w-full">
                      {/* Image Section */}
                      <img
                        src={product.coverImage}
                        alt={product.title}
                        className="w-full h-56 object-cover rounded-t-xl"
                      />

                      <div className="p-5">
                        {/* Title */}
                        <h3 className="text-lg font-semibold text-indigo-900 truncate mb-2 hover:text-indigo-700 transition-colors duration-200">
                          {product.title}
                        </h3>

                        {/* Author */}
                        <p className="text-sm text-indigo-700 mb-2">
                          by <span className="font-semibold">{product.author}</span>
                        </p>

                        {/* Price */}
                        <p className="text-lg font-bold text-indigo-800 mb-4">
                          Rs. {product.price}
                        </p>

                        {/* Buttons */}
                        <div className="flex justify-between items-center gap-4">
                          {/* Add to Cart Button */}
                          <button className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg shadow-md flex items-center justify-center transition-all duration-300">
                            <ShoppingCart size={18} />
                          </button>

                          {/* Bookmark Button */}
                          <button className="w-12 bg-white border border-indigo-300 hover:bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg">
                            <Bookmark size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

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
                  className={`px-4 py-2 rounded ${currentPage === i + 1
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
