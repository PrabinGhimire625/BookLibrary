import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listAllCartItem, removeBookFromCart } from '../../store/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import { fetchDeliveredOrders, submitOrder } from '../../store/orderSlice';
import { toast } from 'react-toastify';
import Navbar from '../../globals/Navbar';
import Footer from '../../globals/Footer';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const { deliveredOrders } = useSelector((state) => state.order);

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [error, setError] = useState('');
  const [discount, setDiscount] = useState(0); // Store discount value
  const [totalPrice, setTotalPrice] = useState(0); // Store total price after discount

  useEffect(() => {
    dispatch(listAllCartItem());
    dispatch(fetchDeliveredOrders());
  }, [dispatch]);

  const totalQuantity = cart.reduce((sum, item) => sum + (item.totalItems || 0), 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + (item.book?.price || 0) * (item.totalItems || 1),
    0
  );

  // Set shipping fee to 0 directly
  const shipping = 0;

  let calculatedTotal = subtotal + shipping;

  // Apply discount logic
  const handleDiscount = () => {
    let appliedDiscount = 0;

    // Apply 5% discount for 5+ books
    if (totalQuantity >= 5) {
      appliedDiscount += 5;
    }

    // Fetch the successful orders count and apply additional 10% discount if needed
    const successfulOrders = deliveredOrders.length; // This should come from the backend
    if (successfulOrders >= 10) {
      appliedDiscount += 10; // 10% discount for 10 successful orders
    }

    setDiscount(appliedDiscount);

    // Calculate total after discount
    const discountAmount = (appliedDiscount / 100) * subtotal;
    setTotalPrice(calculatedTotal - discountAmount);
  };

  useEffect(() => {
    handleDiscount();
  }, [cart, totalQuantity, subtotal, deliveredOrders]);

  const handlePlaceOrder = async () => {
    const phoneRegex = /^[0-9]+$/;

    if (!phoneNumber || !shippingAddress) {
      setError('Please fill in all required fields');
      return;
    }

    if (!phoneRegex.test(phoneNumber)) {
      toast.error('Phone number must contain only digits.');
      return;
    }

    setError('');

    const orderData = {
      phoneNumber,
      shippingAddress,
      orderItems: cart.map((item) => ({
        bookId: item.book.id,
        quantity: item.totalItems,
        unitPrice: item.book.price,
      })),
    };

    try {
      await dispatch(submitOrder(orderData));
      toast.success("Order placed successfully!");
      navigate('/myOrder'); // optional navigation after order
    } catch (err) {
      console.error('Failed to place order:', err);
      setError('Order placement failed. Please try again.');
      toast.error('Failed to place order. Please try again.');
    }
  };


  return (
    <>
      <Navbar />
      <div className="pt-16 px-4 md:px-8 max-w-screen-xl mx-auto">
        <div className="min-h-screen text-gray-900 py-10">
          <h1 className="text-3xl font-extrabold text-center mb-10 tracking-wide">🛍️ Checkout</h1>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 px-6">
            {/* Order Summary */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
              <p className="text-gray-500">Review your order before placing it.</p>

              <div className="mt-5 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center text-gray-400 text-lg">Your cart is empty.</div>
                ) : (
                  cart.map((item) => (
                    <div key={item.cartId} className="flex items-center bg-gray-50 border border-gray-200 p-4 rounded-lg">
                      <img
                        src={item.book?.coverImage || '/placeholder.jpg'}
                        alt={item.book?.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-bold">{item.book?.title}</h3>
                        <p className="text-sm text-gray-500">By {item.book?.author}</p>
                        <p className="text-sm text-gray-500">{item.book?.category}</p>
                        <p className="text-xs text-gray-400">Published: {item.book?.publicationDate}</p>
                        <p className="mt-2 text-sm">Quantity: <span className="font-semibold">{item.totalItems}</span></p>
                        <p className="text-md font-semibold text-gray-700">Rs. {item.book?.price || '0'}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Payment & Shipping Details */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold text-gray-800">Payment & Shipping</h2>

              {/* Payment Method */}
              <p className="mt-4 text-lg font-medium">Payment Method</p>
              <div className="mt-3">
                <label className="flex items-center space-x-2 bg-gray-100 border border-gray-300 p-4 rounded-lg">
                  <input
                    type="radio"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="hidden"
                  />
                  <span className="w-5 h-5 border-2 border-gray-500 rounded-full flex items-center justify-center">
                    {paymentMethod === 'COD' && <span className="w-3 h-3 bg-gray-800 rounded-full"></span>}
                  </span>
                  <p className="font-medium">Cash on Delivery</p>
                </label>
              </div>

              {/* Shipping Details */}
              <div className="mt-6">
                <label className="block font-medium text-gray-700">Phone Number</label>
                <input
                  type="text"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300"
                />

                <label className="block font-medium text-gray-700 mt-4">Shipping Address</label>
                <textarea
                  placeholder="Enter delivery address"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300"
                />
              </div>

              {/* Error Message */}
              {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

              {/* Order Summary */}
              <div className="mt-6 border-t pt-4">
                <div className="flex justify-between">
                  <p className="text-gray-700">Total Items</p>
                  <p className="text-gray-700">{cart.length}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-700">Total Quantity</p>
                  <p className="text-gray-700">{totalQuantity}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-700">Subtotal</p>
                  <p className="text-gray-700">Rs. {subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-700">Shipping</p>
                  <p className="text-gray-700">Rs. {shipping}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-700">Discount</p>
                  <p className="text-gray-700">
                    - Rs. {(subtotal * discount / 100).toFixed(2)} ({discount}%)
                  </p>
                </div>
                <div className="flex justify-between font-semibold">
                  <p className="text-lg">Total</p>
                  <p className="text-lg">Rs. {totalPrice.toFixed(2)}</p>
                </div>
              </div>

              {/* Place Order Button */}
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handlePlaceOrder}
                  className="bg-blue-500 text-white p-3 rounded-lg w-full"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Checkout;
