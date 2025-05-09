import React, { useEffect, useState } from "react";
import { ShoppingCart, Bookmark } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { listAllCategory } from "../../store/categorySlice";
import { listAllGenre } from "../../store/genreSlice";
import { getAllBooks } from "../../store/ReviewSlice";
import { Link } from "react-router-dom";
import Navbar from "../../globals/Navbar";
import Footer from "../../globals/Footer";

const PRODUCTS_PER_PAGE = 9;

export default function ProductPage() {
  const dispatch = useDispatch();
  const { status, allBooks } = useSelector((state) => state.review);
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
  const [sortBy, setSortBy] = useState("title");

  useEffect(() => {
    dispatch(getAllBooks());
    dispatch(listAllCategory());
    dispatch(listAllGenre());
  }, [dispatch]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const sortBooks = (books) => {
    switch (sortBy) {
      case "title":
        return books.sort((a, b) => a.title.localeCompare(b.title));
      case "publicationDate":
        return books.sort((a, b) => new Date(b.publicationDate) - new Date(a.publicationDate));
      case "price":
        return books.sort((a, b) => a.price - b.price);
      case "popularity":
        return books.sort((a, b) => b.sales - a.sales);
      default:
        return books;
    }
  };

  const filteredBooks = allBooks?.filter((b) => {
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

  const sortedBooks = sortBooks(filteredBooks);
  const totalPages = Math.ceil(sortedBooks?.length / PRODUCTS_PER_PAGE);
  const paginatedBooks = sortedBooks?.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const uniqueAuthors = Array.from(new Set(allBooks?.map((b) => b.author)));
  const uniquePublishers = Array.from(new Set(allBooks?.map((b) => b.publisher)));

  return (
    <>
      <Navbar />
      <div className="pt-16 px-4 md:px-8 max-w-screen-xl mx-auto">
        <div className=" bg-gray-30">

          <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Filters */}
              <aside className="md:w-1/5 p-6 bg-white shadow-lg rounded-xl">
                <h2 className="text-xl font-bold mb-4 text-indigo-700">Filter Books</h2>
                <input
                  type="text"
                  name="search"
                  placeholder="Search..."
                  value={filters.search}
                  onChange={handleFilterChange}
                  className="w-full mb-4 p-2 border rounded focus:outline-gray-200"
                />
                <select name="author" value={filters.author} onChange={handleFilterChange} className="w-full mb-4 p-2 border rounded">
                  <option value="">Author</option>
                  {uniqueAuthors.map((a) => <option key={a}>{a}</option>)}
                </select>
                <select name="genre" value={filters.genre} onChange={handleFilterChange} className="w-full mb-4 p-2 border rounded">
                  <option value="">Genre</option>
                  {genre.map((g) => <option key={g._id} value={g.genreName}>{g.genreName}</option>)}
                </select>
                <select name="category" value={filters.category} onChange={handleFilterChange} className="w-full mb-4 p-2 border rounded">
                  <option value="">Category</option>
                  {category.map((c) => <option key={c._id} value={c.categoryName}>{c.categoryName}</option>)}
                </select>
                <select name="priceRange" value={filters.priceRange} onChange={handleFilterChange} className="w-full mb-4 p-2 border rounded">
                  <option value="">Price Range</option>
                  <option value="0-500">0 - 500</option>
                  <option value="500-1000">500 - 1000</option>
                  <option value="1000-5000">1000 - 5000</option>
                  <option value="5000+">5000+</option>
                </select>
              </aside>

              {/* Book Grid */}
              <main className="md:w-4/5">
                {/* Book Grid */}
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-800">Books</h1>
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
                  <p>Loading books...</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {paginatedBooks.map((book) => (
                      <Link
                        to={`/singleBook/${book.id}`}
                        key={book.id}
                        className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-3 flex flex-col items-center cursor-pointer hover:scale-[1.02] transform transition-transform"
                      >
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-24 h-28 object-cover rounded mb-2"
                        />
                        <div className="text-center">
                          <h3 className="text-sm font-semibold text-indigo-800 truncate w-32">
                            {book.title}
                          </h3>
                          <p className="text-xs text-gray-600 italic truncate w-32">
                            {book.author}
                          </p>
                          <p className="text-xs text-gray-500 truncate w-32">
                            {book.genre} • {book.category}
                          </p>
                          <p className="text-sm text-yellow-500 font-medium">
                            ⭐ {book.averageRating?.toFixed(1) || "N/A"}
                          </p>
                          <p className="text-sm text-green-600 font-semibold">
                            {book.isOnSale ? `₹${book.price}` : "Not for Sale"}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                <div className="flex justify-center mt-6">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      className={`px-3 py-1 mx-1 rounded ${currentPage === i + 1
                        ? "bg-indigo-600 text-white"
                        : "bg-white border text-indigo-600"
                        }`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
       <Footer/>
    </>
  );
}
