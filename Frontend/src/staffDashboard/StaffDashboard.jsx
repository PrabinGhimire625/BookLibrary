import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { fetchAllOrders } from '../components/store/orderSlice';
import { FiLogOut } from 'react-icons/fi';
import { resetStatus } from '../components/store/authSlice';

const StaffDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { status, allOrders } = useSelector((state) => state.order);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        dispatch(fetchAllOrders());
    }, [dispatch]);

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center w-full h-screen">
                <div className="loader">Loading orders...</div>
            </div>
        );
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        dispatch(resetStatus());
        navigate("/login");
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Top bar with logout */}
            <div className="flex justify-end p-4 bg-white shadow-md">
                <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                >
                    <FiLogOut className="text-xl mr-2" />
                    <span className="font-medium">Log out</span>
                </button>
            </div>

            {/* Content */}
            <div className="flex flex-col md:flex-row w-full p-6">
                <div className="w-full">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Order List</h2>
                    <div className="bg-white p-6 rounded-lg shadow-xl overflow-x-auto">
                        <table className="w-full table-auto text-sm">
                            <thead className="bg-gray-200 text-gray-700">
                                <tr>
                                    <th className="py-3 px-4 text-left">Order ID</th>
                                    <th className="py-3 px-4 text-left">Phone Number</th>
                                    <th className="py-3 px-4 text-left">Shipping Address</th>
                                    <th className="py-3 px-4 text-left">Total Price</th>
                                    <th className="py-3 px-4 text-left">Order Status</th>
                                    <th className="py-3 px-4 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allOrders?.map((order) => (
                                    <tr
                                        key={order.orderId}
                                        className="hover:bg-gray-50 cursor-pointer transition duration-200 ease-in-out"
                                    >
                                        <td className="py-3 px-4">{order.orderId}</td>
                                        <td className="py-3 px-4">{order.phoneNumber}</td>
                                        <td className="py-3 px-4">{order.shippingAddress || 'N/A'}</td>
                                        <td className="py-3 px-4">${order.totalPrice / 100}</td>
                                        <td className="py-3 px-4">
                                            {order.orderStatus === 3
                                                ? 'Delivered'
                                                : order.orderStatus === 4
                                                    ? 'Cancelled'
                                                    : 'Pending'}
                                        </td>
                                        <td className="py-3 px-4 flex space-x-2">
                                            <button
                                                onClick={() => navigate(`/editOrder/${order.orderId}`)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;
