import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, CheckCircle } from 'lucide-react';
import { FiLogOut } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { fetchAllOrders, resetStatus, staffVerifyAndChangeStatus } from '../components/store/orderSlice';
import { STATUS } from '../components/globals/status/status';

const StaffDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { status, allOrders } = useSelector((state) => state.order);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        dispatch(fetchAllOrders());
    }, [dispatch]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        dispatch(resetStatus());
        navigate("/login");
    };

    const handleVerify = async (orderId) => {
        const code = prompt("Enter the claim code:");
        if (!code) {
            toast.warn("Claim code is required.");
            return;
        }

        await dispatch(staffVerifyAndChangeStatus(orderId, code));
        const updatedStatus = await store.getState().order.status;

        if (updatedStatus === STATUS.SUCCESS) {
            toast.success("Order marked as Delivered.");
            dispatch(fetchAllOrders());
        } else {
            toast.error("Verification failed. Invalid code or server error.");
        }
    };

    if (status === STATUS.LOADING) {
        return (
            <div className="flex items-center justify-center w-full h-screen">
                <div className="loader text-xl font-semibold text-gray-700">Loading orders...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-slate-100">
            {/* Top bar with logout */}
            <div className="flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-10">
                <h1 className="text-xl font-bold text-gray-700">📦 Staff Dashboard</h1>
                <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                >
                    <FiLogOut className="text-xl mr-2" />
                    <span className="font-medium">Log out</span>
                </button>
            </div>

            {/* Content */}
            <div className="p-6 w-full max-w-7xl mx-auto">
                <h2 className="text-3xl font-semibold text-gray-800 mb-6">📋 Order Management</h2>
                <div className="bg-white p-6 rounded-2xl shadow-xl overflow-x-auto">
                    <table className="w-full table-auto text-sm border border-gray-200 rounded-xl">
                        <thead className="bg-gray-100 text-gray-700">
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
                                    className="hover:bg-gray-50 transition duration-200 ease-in-out border-b"
                                >
                                    <td className="py-3 px-4 font-mono text-xs text-blue-700">{order.orderId}</td>
                                    <td className="py-3 px-4">{order.phoneNumber}</td>
                                    <td className="py-3 px-4">{order.shippingAddress || 'N/A'}</td>
                                    <td className="py-3 px-4 font-medium text-green-600">Rs {(order.totalPrice).toFixed(2)}</td>
                                    <td className="py-3 px-4">
                                        {order.orderStatus === 3 ? (
                                            <span className="text-green-600 font-semibold flex items-center"><CheckCircle className="w-4 h-4 mr-1" /> Delivered</span>
                                        ) : order.orderStatus === 4 ? (
                                            <span className="text-red-600 font-semibold">Cancelled</span>
                                        ) : (
                                            <span className="text-yellow-600 font-semibold">Pending</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 flex space-x-3 items-center">
                                      
                                        <button
                                            onClick={() => handleVerify(order.orderId)}
                                            className={`text-green-600 hover:text-green-800 transition ${order.orderStatus === 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            disabled={order.orderStatus === 3}
                                            title="Verify Order"
                                        >
                                            Verify
                                        </button>
                                        <button
                                            className="text-red-600 hover:text-red-800 transition"
                                            title="Delete Order"
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
    );
};

export default StaffDashboard;
