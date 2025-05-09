import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Navbar from "../../globals/Navbar";
import {
  fetchPendingOrders,
  fetchDeliveredOrders,
  fetchCancelledOrder,
  resetOrderState,
} from "../../store/orderSlice";
import Footer from "../../globals/Footer";

const MyOrder = () => {
  const dispatch = useDispatch();
  const { pendingOrders, deliveredOrders, cancelOrder } = useSelector(
    (state) => state.order
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("pending");

  useEffect(() => {
    dispatch(fetchPendingOrders());
    dispatch(fetchDeliveredOrders());
    dispatch(fetchCancelledOrder());

    return () => {
      dispatch(resetOrderState());
    };
  }, [dispatch]);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleFilterChange = (e) => setFilter(e.target.value);

  const filterOrders = (orders) =>
    orders.filter((order) =>
      order.orderId.toString().includes(searchQuery)
    );

  const renderOrderTable = (orders) => (
    <div className="overflow-x-auto bg-white shadow-xl rounded-xl p-4">
      <table className="min-w-full text-sm text-gray-800">
        <thead className="bg-gray-100 rounded-t-lg">
          <tr className="text-left">
            <th className="px-6 py-3 font-semibold tracking-wide">Items</th>
            <th className="px-6 py-3 font-semibold tracking-wide">Total Amt</th>
            <th className="px-6 py-3 font-semibold tracking-wide">Order Status</th>
            <th className="px-6 py-3 font-semibold tracking-wide">Ordered At</th>
          </tr>
        </thead>
        <tbody>
          {filterOrders(orders).map((order) => {
            const totalAmount = order.items.reduce(
              (acc, item) => acc + item.pricePerUnit * item.quantity,
              0
            );
            const orderedAt = new Date(order.orderDate).toLocaleString();

            return (
              <tr
                key={order.orderId}
                className="border-b hover:bg-gray-30 transition duration-200"
              >
                <td className="px-6 py-4">
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <Link
                        key={index}
                        to={`/orderDetails/${order.orderId}`}
                        className="flex items-center gap-4 cursor-pointer"
                      >
                        <img
                          src={item.coverImage}
                          alt={item.bookTitle}
                          className="w-14 h-20 object-cover rounded-lg shadow-sm"
                        />
                        <div>
                          <p className="text-sm font-medium">{item.bookTitle}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          <p className="text-xs text-gray-500">Rs. {item.pricePerUnit}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900">
                  <Link to={`/orderDetails/${order.orderId}`}>Rs. {totalAmount.toFixed(2)}</Link>
                </td>
                <td className="px-6 py-4">
                  <Link to={`/orderDetails/${order.orderId}`}>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <Link to={`/orderDetails/${order.orderId}`}>{orderedAt}</Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="pt-16 px-4 md:px-8 max-w-screen-xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 mt-4">My Orders</h2>

        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6">
          <div className="flex gap-2">
            <div className="relative">
              <select
                className="appearance-none h-full rounded border border-gray-400 bg-white text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-gray-500"
                value={filter}
                onChange={handleFilterChange}
              >
                <option value="pending">Pending</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="relative w-full sm:w-2/3">
            <input
              placeholder="Search Orders"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full h-12 rounded-xl border-2 border-gray-300 bg-white text-sm text-gray-800 placeholder-gray-400 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ease-in-out"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-4">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 text-gray-500"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-3xl font-semibold text-gray-900 mb-4">
            {filter === "pending"
              ? "Pending Orders"
              : filter === "delivered"
              ? "Delivered Orders"
              : "Cancelled Orders"}
          </h3>
          {filter === "pending" && renderOrderTable(pendingOrders)}
          {filter === "delivered" && renderOrderTable(deliveredOrders)}
          {filter === "cancelled" && renderOrderTable(cancelOrder)}
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default MyOrder;
