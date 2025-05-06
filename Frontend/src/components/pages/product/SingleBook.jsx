import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import { listSingleBook } from '../../store/bookSlice';
import { FaHeart, FaMoneyBillWave, FaShoppingCart, FaMinus, FaPlus } from 'react-icons/fa';
import { addToCart } from '../../store/cartSlice';
import { STATUS } from '../../globals/status/status';
import { toast } from 'react-toastify';

const SingleBook = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { singleBook, status } = useSelector((state) => state.book);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (id) {
            dispatch(listSingleBook(id));
        }
    }, [dispatch, id]);

    if (!singleBook) {
        return (
            <div className="text-center text-xl text-gray-600 min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    const increaseQty = () => {
        if (quantity < singleBook.stock) {
            setQuantity((prev) => prev + 1);
        }
    };

    const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));



    console.log("singleBook", singleBook)

    //handle add to cart
    const handleAddToCart = () => {
        if (id && singleBook) {
            dispatch(addToCart(id, quantity));
            if (status === STATUS.SUCCESS) {
                toast.success("Item added to cart");
            } else if (status === STATUS.ERROR) {
                toast.error("Failed to add book on cart.");
            }

        }
    };


    return (
        <div className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 relative">
                {/* Left: Book Image */}
                <div className="md:w-1/2 relative">
                    <div className="bg-gray-100 p-6 rounded-xl shadow-xl hover:shadow-2xl transition">
                        <img
                            src={singleBook.coverImage}
                            alt={singleBook.title}
                            className="w-full object-cover rounded-lg"
                        />
                    </div>

                    {/* Wishlist Button */}
                    <button className="absolute top-4 right-4 border border-gray-300 text-gray-700 bg-white rounded-full p-2 hover:bg-gray-100 transition shadow-sm">
                        <FaHeart size={20} title="Add to Wishlist" />
                    </button>
                </div>

                {/* Right: Book Info */}
                <div className="md:w-1/2 flex flex-col justify-between h-full">
                    <div className="h-full flex flex-col justify-between">
                        <div>
                            <h1 className="text-5xl font-bold text-gray-900 mb-4">{singleBook.title}</h1>
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

                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-lg font-medium">Quantity:</span>
                                <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-lg">
                                    <button onClick={decreaseQty} className="p-1 hover:text-red-500">
                                        <FaMinus />
                                    </button>
                                    <span className="px-3 font-semibold text-xl">{quantity}</span>
                                    <button
                                        onClick={increaseQty}
                                        className={`p-1 hover:text-green-500 ${quantity >= singleBook.stock ? 'text-gray-400 cursor-not-allowed' : ''}`}
                                        disabled={quantity >= singleBook.stock} // Disable the button when quantity reaches stock
                                    >
                                        <FaPlus />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <button onClick={handleAddToCart} className="flex items-center gap-3 bg-blue-400 hover:bg-blue-500 text-white px-6 py-3 text-lg rounded-lg shadow-md transition">
                                    <FaShoppingCart /> Add to Cart
                                </button>
                                <button className="flex items-center gap-3 bg-blue-400 hover:bg-blue-500 text-white px-6 py-3 text-lg rounded-lg shadow-md transition">
                                    <FaMoneyBillWave /> Buy Now
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SingleBook;

