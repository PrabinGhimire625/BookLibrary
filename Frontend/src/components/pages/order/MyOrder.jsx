import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchDeliveredOrders, fetchPendingOrders, resetOrderState } from "../../store/orderSlice";

const MyOrder = () => {
  const dispatch = useDispatch();
  const { myOrders, pendingOrders, deliveredOrders, status } = useSelector(
    (state) => state.order
  );
  const [filter, setFilter] = useState("pending"); // Set default filter to "pending"
  const [searchQuery, setSearchQuery] = useState(""); // Manage search query

  // Fetch orders when the component mounts or filter changes
  useEffect(() => {
    if (filter === "pending") {
      dispatch(fetchPendingOrders());
    } else if (filter === "delivered") {
      dispatch(fetchDeliveredOrders());
    }

    // Cleanup orders when component unmounts or filter changes
    return () => {
      dispatch(resetOrderState());
    };
  }, [dispatch, filter]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Adjusted filter logic for displaying orders
  const filteredOrders = (filter === "pending" ? pendingOrders : deliveredOrders).filter((order) =>
    order.orderId.toString().includes(searchQuery)
  );


  console.log("pendingOrders", pendingOrders);
  console.log("deliveredOrders", deliveredOrders)
  return (
    <div className="antialiased font-sans bg-white pt-2">
      <div className="container mx-auto px-4 sm:px-8">
        <div>
          <div>
            <h2 className="text-2xl font-semibold leading-tight">My Orders</h2>
          </div>

          {/* Search UI */}
          <div className="my-2 flex sm:flex-row flex-col gap-2">
            <div className="relative">
              <select
                className="appearance-none h-full rounded border border-gray-400 bg-white text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-gray-500"
                value={filter}
                onChange={handleFilterChange}
              >
                <option value="pending">Pending</option>
                <option value="delivered">Delivered</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            <div className="block relative">
              <span className="h-full absolute inset-y-0 left-0 flex items-center pl-2">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-gray-500">
                  <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z" />
                </svg>
              </span>
              <input
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchChange}
                className="appearance-none border pl-8 pr-6 py-2 w-full rounded border-gray-400 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Table */}
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">OrderId</th>
                    <th className="px-5 py-3 border-b-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Amt</th>
                    {/* <th className="px-5 py-3 border-b-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment Status</th> */}
                    <th className="px-5 py-3 border-b-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order Status</th>
                    <th className="px-5 py-3 border-b-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ordered At</th>
                    <th className="px-5 py-3 border-b-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                {filteredOrders.map((order) => {
  const totalAmount = order.items.reduce(
    (acc, item) => acc + item.pricePerUnit * item.quantity,
    0
  );
  const orderedAt = new Date(order.orderDate).toLocaleString();

  return (
    <tr key={order.orderId}>
      <td className="px-5 py-5 border-b bg-white text-sm">
        <Link to={`/myOrders/${order.orderId}`} className="text-blue-900 underline">
          {order.orderId}
        </Link>
      </td>
      <td className="px-5 py-5 border-b bg-white text-sm">${totalAmount}</td>
      {/* <td className="px-5 py-5 border-b bg-white text-sm">Unpaid</td> */}
      <td className="px-5 py-5 border-b bg-white text-sm">{order.status}</td>
      <td className="px-5 py-5 border-b bg-white text-sm">{orderedAt}</td>
      <td className="px-5 py-5 border-b bg-white text-md">
        <Link to={`/orderDetails/${order.orderId}`} className="text-blue-800 text-lg">
          MANAGE
        </Link>
      </td>
    </tr>
  );
})}

                </tbody>
              </table>
              <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">
                <span className="text-xs xs:text-sm text-gray-900">
                  Showing {filteredOrders.length} of {filteredOrders.length} Entries
                </span>
                <div className="inline-flex mt-2 xs:mt-0">
                  <button className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l">Prev</button>
                  <button className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r">Next</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrder;
