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

const SingleBook = () => {
    const { id } = useParams();
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
            await dispatch(addToCart({ id, quantity }));
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
            <div className="text-center text-xl text-gray-600 min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 relative">
                {/* Left: Book Image */}
                <div className="relative flex justify-center mb-8 md:mb-0">
                    <div className="bg-gray-100 p-6 rounded-xl shadow-xl hover:shadow-2xl transition transform hover:scale-105">
                        <img
                            src={singleBook.coverImage}
                            alt={singleBook.title}
                            className="w-full object-cover rounded-lg"
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
                            className={`hover:text-indigo-600 ${isInWhiteList ? 'text-red-500' : 'text-gray-500'}`}
                        />
                    </button>
                </div>

                {/* Right: Book Info */}
                <div className="flex flex-col justify-between">
                    <div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">{singleBook.title}</h1>
                        <div className="flex flex-wrap gap-4 mb-6">
                            <span className="bg-blue-100 text-blue-800 text-base font-semibold px-4 py-2 rounded-full">
                                Genre: {singleBook.genre}
                            </span>
                            <span className="bg-purple-100 text-purple-800 text-base font-semibold px-4 py-2 rounded-full">
                                Category: {singleBook.category}
                            </span>
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-4xl font-bold text-indigo-600">${singleBook.price}</span>
                            {singleBook.isOnSale && (
                                <span className="text-md text-green-600 bg-green-100 px-4 py-2 rounded-full font-medium">
                                    On Sale
                                </span>
                            )}
                        </div>

                        <div className="text-lg text-gray-700 space-y-3 mb-8 leading-relaxed">
                            <p><span className="font-semibold">Author:</span> {singleBook.author}</p>
                            <p><span className="font-semibold">ISBN:</span> {singleBook.isbn}</p>
                            <p><span className="font-semibold">Published on:</span> {new Date(singleBook.publicationDate).toLocaleDateString()}</p>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Description</h3>
                            <p className="text-lg text-gray-600 leading-relaxed">{singleBook.description}</p>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Quantity</h3>
                            <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-lg">
                                <button onClick={decreaseQty} className="p-1 hover:text-red-500">
                                    <FaMinus />
                                </button>
                                <span className="px-3 font-semibold text-xl">{quantity}</span>
                                <button
                                    onClick={increaseQty}
                                    className={`p-1 ${quantity >= singleBook.stock ? 'text-gray-400 cursor-not-allowed' : 'hover:text-green-500'}`}
                                    disabled={quantity >= singleBook.stock}
                                >
                                    <FaPlus />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={handleAddToCart}
                                className="flex items-center gap-3 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 text-lg rounded-lg shadow-md transition"
                            >
                                <FaShoppingCart /> Add to Cart
                            </button>
                            <button
                                className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-6 py-3 text-lg rounded-lg shadow-md transition"
                            >
                                <FaMoneyBillWave /> Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-12 max-w-5xl mx-auto px-4">
                <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Reviews</h2>
                {singleBookReview && singleBookReview.length > 0 ? (
                    singleBookReview.map((review) => (
                        <div
                            key={review.reviewId}
                            className="bg-white shadow-md rounded-lg p-6 mb-8 border border-gray-200"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <span className="font-semibold text-gray-700">{review.user.name}</span>
                                <span className="text-yellow-500 text-sm">{'⭐'.repeat(review.rating)}</span>
                            </div>
                            <p className="text-gray-600 mb-2">{review.comment}</p>
                            <p className="text-sm text-gray-500">{new Date(review.reviewDate).toLocaleDateString()}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600 text-center">No reviews yet.</p>
                )}
            </div>

        </div>
    );
};

export default SingleBook;
