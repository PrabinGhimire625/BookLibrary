import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { listSingleBook } from '../../store/bookSlice';
import { FaHeart, FaMoneyBillWave, FaShoppingCart, FaMinus, FaPlus } from 'react-icons/fa';
import { addToCart } from '../../store/cartSlice';
import { STATUS } from '../../globals/status/status';
import { toast } from 'react-toastify';
import { Bookmark } from 'lucide-react';
import { addToWhiteList, listAllWhiteList, removeBookFromWhiteList } from '../../store/whiteListSlice';
import { listSingleBookReview } from '../../store/ReviewSlice';
import Navbar from '../../globals/Navbar';
import Footer from '../../globals/Footer';

const SingleBook = () => {
    const { id } = useParams();
    console.log("ID for the single book", id);
    const dispatch = useDispatch();
    const { singleBook, status } = useSelector((state) => state.book);
    const { singleBookReview } = useSelector((state) => state.review);
    const { whiteList } = useSelector((state) => state.whiteList);

    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (id) {
            dispatch(listSingleBook(id));
            dispatch(listSingleBookReview(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        dispatch(listAllWhiteList());
    }, []);

    const increaseQty = () => {
        if (singleBook && quantity < singleBook.stock) {
            setQuantity((prev) => prev + 1);
        }
    };

    const decreaseQty = () => {
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    };

    const handleAddToWhitelist = async () => {
        if (id) {
            if (isInWhiteList) {
                const result = await dispatch(removeBookFromWhiteList(id));
                if (status === STATUS.SUCCESS) {
                    toast.success("Book removed from whitelist");
                    window.location.reload();
                } else if (status === STATUS.ERROR) {
                    toast.error("Failed to remove book from whitelist.");
                }
            } else {
                const result = await dispatch(addToWhiteList(id));
                if (status === STATUS.SUCCESS) {
                    toast.success("Book added to whitelist");
                    window.location.reload();
                } else if (status === STATUS.ERROR) {
                    toast.error("Failed to add book to whitelist.");
                }
            }
        }
    };

    const handleAddToCart = async () => {
        if (id && singleBook) {
            await dispatch(addToCart(id, quantity));
            if (status === STATUS.SUCCESS) {
                toast.success("Book successfully added to cart!");
            } else if (status === STATUS.ERROR) {
                toast.error("Failed to add book to cart.");
            }
        }
    };

    const isInWhiteList = whiteList.some((book) => book.bookId === id);

    if (status === STATUS.LOADING || !singleBook) {
        return (
            <div className="text-center text-base text-gray-600 min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="pt-16 px-4 md:px-8 max-w-screen-xl mx-auto">
                <div className="bg-white min-h-screen py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 py-10 px-6 relative">
                        {/* Left: Book Image */}
                        <div className="relative flex justify-center items-center">
                            <div className="bg-white p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-transform transform hover:scale-105 flex justify-center">
                                <img
                                    src={singleBook.coverImage}
                                    alt={singleBook.title}
                                    className="w-[300px] object-cover rounded-xl"
                                />
                            </div>
                            {/* Wishlist Button */}
                            <button
                                aria-label="Add to wishlist"
                                title="Add to wishlist"
                                className="absolute top-4 right-4 border border-gray-300 text-gray-700 bg-white rounded-full p-2 hover:bg-gray-100 transition shadow-sm"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleAddToWhitelist();
                                }}
                            >
                                <Bookmark
                                    size={20}
                                    className={`transition ${isInWhiteList ? 'text-red-500' : 'text-gray-500'} hover:text-indigo-600`}
                                />
                            </button>
                        </div>

                        {/* Right: Book Info */}
                        <div className="flex flex-col justify-between space-y-6">
                            <div className="space-y-4">
                                <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">{singleBook.title}</h1>

                                <div className="flex flex-wrap gap-3">
                                    <span className="bg-blue-100 text-blue-700 px-4 py-1 text-sm rounded-full font-semibold">
                                        Genre: {singleBook.genre}
                                    </span>
                                    <span className="bg-purple-100 text-purple-700 px-4 py-1 text-sm rounded-full font-semibold">
                                        Category: {singleBook.category}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 text-2xl font-bold">
                                    {singleBook.isOnSale ? (
                                        <>
                                            <span className="text-red-600">Rs.{singleBook.currentPrice}</span>
                                            <span className="line-through text-gray-400 text-xl">Rs.{singleBook.price}</span>
                                            <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md font-semibold">
                                                -{Math.round(100 - ((singleBook.discountedPrice ?? (singleBook.price * 0.8)) / singleBook.price) * 100)}%
                                            </span>
                                            <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-md font-semibold">
                                                On Sale
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-gray-800">Rs.{singleBook.price}</span>
                                    )}
                                </div>

                                <hr className="my-4 border-gray-300" />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-gray-700 text-sm">
                                    <p><span className="font-medium text-gray-900">Author:</span> {singleBook.author}</p>
                                    <p><span className="font-medium text-gray-900">ISBN:</span> {singleBook.isbn}</p>
                                    <p><span className="font-medium text-gray-900">Published:</span> {new Date(singleBook.publicationDate).toLocaleDateString()}</p>
                                    <p><span className="font-medium text-gray-900">Stock:</span> {singleBook.stock}</p>
                                </div>

                                <div className="pt-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed border border-gray-200 rounded-lg p-4 bg-gray-50">
                                        {singleBook.description}
                                    </p>
                                </div>

                                <div className="pt-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Quantity</h3>
                                    <div className="flex items-center gap-4 bg-gray-100 px-5 py-2 rounded-full w-fit">
                                        <button onClick={decreaseQty} className="text-gray-700 hover:text-red-500">
                                            <FaMinus />
                                        </button>
                                        <span className="text-lg font-medium">{quantity}</span>
                                        <button
                                            onClick={increaseQty}
                                            className={`text-gray-700 ${quantity >= singleBook.stock ? 'text-gray-400 cursor-not-allowed' : 'hover:text-green-600'}`}
                                            disabled={quantity >= singleBook.stock}
                                        >
                                            <FaPlus />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4 pt-4">
                                    <button
                                        onClick={handleAddToCart}
                                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl shadow-md transition"
                                    >
                                        <FaShoppingCart /> Add to Cart
                                    </button>
                                    <button
                                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl shadow-md transition"
                                    >
                                        <FaMoneyBillWave /> Buy Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Reviews Section */}
                    <div className="mt-8 max-w-4xl mx-auto px-4">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Reviews</h2>
                        {singleBookReview && singleBookReview.length > 0 ? (
                            singleBookReview.map((review) => (
                                <div
                                    key={review.reviewId}
                                    className="bg-white shadow-sm rounded-lg p-4 mb-6 border border-gray-200"
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-gray-700 text-sm">{review.user.name}</span>
                                        <span className="text-yellow-500 text-xs">{'⭐'.repeat(review.rating)}</span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-1">{review.comment}</p>
                                    <p className="text-xs text-gray-500">{new Date(review.reviewDate).toLocaleDateString()}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-600 text-center text-sm">No reviews yet.</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default SingleBook;
