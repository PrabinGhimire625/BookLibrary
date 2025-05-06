import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  addToCart,
  listAllCartItem,
  removeBookFromCart,
  updateCartItem
} from '../../store/cartSlice'
import { Link } from 'react-router-dom'

const Cart = () => {
  const dispatch = useDispatch()
  const { cart } = useSelector((state) => state.cart)

  useEffect(() => {
    dispatch(listAllCartItem())
  }, [dispatch])

  const handleDelete = (bookId) => {
    dispatch(removeBookFromCart(bookId))
  }

  const handleDecrease = (bookId, currentQty) => {
    if (currentQty > 1) {
      dispatch(updateCartItem(bookId, currentQty - 1))
    }
  }

  const handleIncrease = (bookId, currentQty) => {
    dispatch(updateCartItem(bookId, currentQty + 1))
  }

  const totalQuantity = cart.reduce((sum, item) => sum + (item.totalItems || 0), 0)
  const subtotal = cart.reduce(
    (sum, item) => sum + (item.book?.price || 0) * (item.totalItems || 1),
    0
  )
  const shipping = cart.length > 0 ? 100 : 0
  const total = subtotal + shipping

  return (
    <div className="min-h-screen bg-white text-gray-900 py-10">
      <h1 className="text-3xl font-extrabold text-center mb-10 tracking-wide">🛒 Your Shopping Cart</h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-6">

        {/* Cart Items */}
        <div className="md:col-span-2 space-y-6">
          {cart.length === 0 ? (
            <div className="text-center text-gray-400 text-lg">Your cart is empty.</div>
          ) : (
            cart.map((item) => (
              <div
                key={item.cartId}
                className="flex flex-col sm:flex-row items-center sm:items-start bg-gray-50 border border-gray-200 p-5 rounded-xl shadow-sm"
              >
                <img
                  src={item.book?.coverImage || '/placeholder.jpg'}
                  alt={item.book?.title || 'Book Cover'}
                  className="w-24 h-24 object-cover rounded-lg mb-4 sm:mb-0 sm:mr-6"
                />

                <div className="flex-1 w-full space-y-2">
                  <h2 className="text-xl font-bold">{item.book?.title || 'Unknown Title'}</h2>
                  <p className="text-sm text-gray-500">By {item.book?.author || 'Unknown Author'}</p>
                  <p className="text-sm text-gray-500">{item.book?.category || 'Uncategorized'}</p>
                  <p className="text-xs text-gray-400">
                    Published: {item.book?.publicationDate || 'N/A'}
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2 border border-gray-300 rounded-md px-2 py-1 bg-white">
                      <button
                        onClick={() => handleDecrease(item.book?.id, item.totalItems)}
                        className="px-2 text-blue-600 hover:text-blue-800 transition"
                      >−</button>
                      <span className="w-8 text-center">{item.totalItems}</span>
                      <button
                        onClick={() => handleIncrease(item.book?.id, item.totalItems)}
                        className="px-2 text-blue-600 hover:text-blue-800 transition"
                      >+</button>
                    </div>

                    {/* Price and Delete */}
                    <div className="flex items-center space-x-4">
                      <p className="font-semibold text-gray-700">
                        Rs. {(item.book?.price || 0).toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleDelete(item.book?.id)}
                        className="text-red-500 hover:text-red-700 transition"
                        title="Remove item"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Summary</h2>

          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Total Items</span>
              <span>{cart.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Quantity</span>
              <span>{totalQuantity}</span>
            </div>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rs. {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Rs. {shipping}</span>
            </div>
            <hr className="border-gray-300" />
            <div className="flex justify-between font-semibold text-gray-800">
              <span>Total</span>
              <span>Rs. {total.toFixed(2)}</span>
            </div>
          </div>

          <Link to="/checkout">
            <button className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 px-4 rounded-lg mt-4 font-medium">
              Proceed to Checkout
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Cart
