import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { searchBookDetails } from "../../store/bookSlice";
import Navbar from "../../globals/Navbar";
import Footer from "../../globals/Footer";


const Search = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const query = new URLSearchParams(location.search).get("query");

    const { searchBook, status } = useSelector((state) => state.book);

    useEffect(() => {
        if (query?.trim()) {
            dispatch(searchBookDetails(query));
        }
    }, [query, dispatch]);

    return (
        <>
            <Navbar />
            <div className="pt-16 px-4 md:px-8 max-w-screen-xl mx-auto">
                <div className="bg-gray-30">
                    <div className="max-w-7xl mx-auto px-4 py-10">
                        <div className="flex flex-col md:flex-row gap-8">
                            <main className="w-full">
                                {status === "loading" ? (
                                    <p>Loading books...</p>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {searchBook.map((book) => (
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
                            </main>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Search;
