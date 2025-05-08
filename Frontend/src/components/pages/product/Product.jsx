import React, { useEffect, useState } from "react";
import Navbar from "../../globals/Navbar";
import { ShoppingCart, Bookmark } from "lucide-react";
import { listAllBook } from "../../store/bookSlice";
import { useDispatch, useSelector } from "react-redux";
import { listAllCategory } from "../../store/categorySlice";
import { listAllGenre } from "../../store/genreSlice";
import { Link } from "react-router-dom";

const PRODUCTS_PER_PAGE = 9;

export default function ProductPage() {
  const dispatch = useDispatch();
  const { status, book } = useSelector((state) => state.book);
  const { category } = useSelector((state) => state.category);
  const { genre } = useSelector((state) => state.genre);

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    author: "",
    genre: "",
    category: "",
    availability: "",
    priceRange: "",
    ratings: "",
    language: "",
    format: "",
    publisher: "",
    search: "",
  });

  const [sortBy, setSortBy] = useState("title"); // Default sort by title

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1); // Reset to first page when sorting
  };

  useEffect(() => {
    dispatch(listAllBook());
    dispatch(listAllCategory());
    dispatch(listAllGenre());
  }, [dispatch]);


  
  // Sorting function
  const sortBooks = (books) => {
    switch (sortBy) {
      case "title":
        return books.sort((a, b) => a.title.localeCompare(b.title));
      case "publicationDate":
        return books.sort((a, b) => new Date(b.publicationDate) - new Date(a.publicationDate));
      case "price":
        return books.sort((a, b) => a.price - b.price);
      case "popularity":
        return books.sort((a, b) => b.sales - a.sales); // Assuming `sales` or `popularity` is tracked in each book
      default:
        return books;
    }
  };

  const filteredBooks = book?.filter((b) => {
    const {
      author,
      genre,
      category,
      availability,
      priceRange,
      ratings,
      language,
      format,
      publisher,
      search,
    } = filters;

    const matchesAuthor = !author || b.author === author;
    const matchesGenre = !genre || b.genre === genre;
    const matchesCategory = !category || b.category === category;
    const matchesAvailability = !availability || b.availability === availability;
    const matchesPriceRange = !priceRange || (() => {
      const [min, max] = priceRange.split("-").map(Number);
      if (priceRange === "5000+") return b.price >= 5000;
      return b.price >= min && b.price <= max;
    })();
    const matchesRatings = !ratings || b.ratings >= Number(ratings);
    const matchesLanguage = !language || b.language === language;
    const matchesFormat = !format || b.format === format;
    const matchesPublisher = !publisher || b.publisher === publisher;
    const matchesSearch =
      !search ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.isbn?.includes(search) ||
      b.description?.toLowerCase().includes(search.toLowerCase());

    return (
      matchesAuthor &&
      matchesGenre &&
      matchesCategory &&
      matchesAvailability &&
      matchesPriceRange &&
      matchesRatings &&
      matchesLanguage &&
      matchesFormat &&
      matchesPublisher &&
      matchesSearch
    );
  });

  // Apply sorting
  const sortedBooks = sortBooks(filteredBooks);

  const totalPages = Math.ceil(sortedBooks?.length / PRODUCTS_PER_PAGE);
  const paginatedBooks = sortedBooks?.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  // Extract unique authors and publishers for dropdowns
  const uniqueAuthors = Array.from(new Set(book?.map((b) => b.author)));
  const uniquePublishers = Array.from(new Set(book?.map((b) => b.publisher)));

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row gap-8 p-6">
        {/* Filter Section */}
        <div className="md:w-1/4 bg-indigo-100/30 border-indigo-200 text-gray-800 p-4 rounded-xl shadow-sm h-fit">
          <h2 className="text-lg font-semibold mb-4">Filter Books</h2>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search by title, ISBN, or description"
            className="w-full border border-gray-300 bg-white text-sm text-gray-700 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          {/* Dynamic Filter Dropdowns */}
          <select
            name="author"
            value={filters.author}
            onChange={handleFilterChange}
            className="w-full border mb-4 p-2 rounded"
          >
            <option value="">Select Author</option>
            {uniqueAuthors.map((author) => (
              <option key={author} value={author}>{author}</option>
            ))}
          </select>

          <select
            name="genre"
            value={filters.genre}
            onChange={handleFilterChange}
            className="w-full border mb-4 p-2 rounded"
          >
            <option value="">Select Genre</option>
            {genre.map((g) => (
              <option key={g._id} value={g.genreName}>{g.genreName}</option>
            ))}
          </select>

          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="w-full border mb-4 p-2 rounded"
          >
            <option value="">Select Category</option>
            {category.map((c) => (
              <option key={c._id} value={c.categoryName}>{c.categoryName}</option>
            ))}
          </select>

          {/* Price Range Filter (if applicable) */}
          <select
            name="priceRange"
            value={filters.priceRange}
            onChange={handleFilterChange}
            className="w-full border mb-4 p-2 rounded"
          >
            <option value="">Select Price Range</option>
            <option value="0-500">0 - 500</option>
            <option value="500-1000">500 - 1000</option>
            <option value="1000-5000">1000 - 5000</option>
            <option value="5000+">5000+</option>
          </select>
        </div>

        {/* Book Grid */}
        <div className="md:w-3/4">
          <h1 className="text-2xl font-bold mb-4">Books</h1>
          <div className="flex justify-end mb-4">
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="border p-2 rounded"
            >
              <option value="title">Sort by Title</option>
              <option value="publicationDate">Sort by Publication Date</option>
              <option value="price">Sort by Price</option>
              <option value="popularity">Sort by Popularity</option>
            </select>
          </div>

          {status === "loading" ? (
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedBooks?.map((item) => (
                <Link to={`/singleBook/${item.id}`} key={item._id}>
                  <div className="bg-white border rounded-lg p-4 shadow-md hover:shadow-xl transition-shadow">
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-full h-48 object-cover rounded mb-4"
                    />
                    <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.author}</p>
                    <p className="text-md font-bold text-indigo-700 mb-2">Rs. {item.price}</p>
                    <div className="flex justify-between items-center">
                      <button
                        className="bg-indigo-600 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-indigo-700"
                        onClick={(e) => {
                          e.preventDefault(); // prevents navigation on click
                          // add to cart logic here
                        }}
                      >
                        <ShoppingCart size={16} />
                        Add to Cart
                      </button>
                      <Bookmark
                        size={20}
                        className="text-gray-500 hover:text-indigo-600 cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault(); // prevents navigation on click
                          // bookmark logic here
                        }}
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center items-center mt-6 gap-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-indigo-500 text-white rounded disabled:bg-gray-300"
            >
              Prev
            </button>
            <span className="text-sm font-medium">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-indigo-500 text-white rounded disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
