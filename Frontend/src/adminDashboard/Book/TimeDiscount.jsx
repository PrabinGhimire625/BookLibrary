import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addTimeDiscount } from '../../components/store/bookSlice';
import Sidebar from '../sidebar/Sidebar';

const TimeDiscount = () => {
    const { bookId } = useParams(); // Get the book ID from the URL
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [discountData, setDiscountData] = useState({
        discountPercentage: '',
        discountStartDate: '',
        discountEndDate: ''
    });

    // Handle form submit
    const handleDiscountSubmit = () => {
        if (!discountData.discountPercentage || !discountData.discountStartDate || !discountData.discountEndDate) {
            toast.error('Please fill all discount fields.');
            return;
        }
        dispatch(addTimeDiscount(bookId, discountData));
        toast.success('Discount added successfully');
        navigate('/listBook'); 
    };


    useEffect(() => {
    }, [bookId]);

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex items-center justify-center bg-gray-100 py-6 px-4 sm:px-6 md:px-8 lg:px-10">
                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-md w-full sm:w-[400px]">
                    <h3 className="text-lg font-semibold mb-4">Set Time Discount</h3>

                    <label className="block text-sm mb-1">Discount Percentage</label>
                    <input
                        type="number"
                        value={discountData.discountPercentage}
                        onChange={(e) => setDiscountData({ ...discountData, discountPercentage: e.target.value })}
                        className="w-full mb-2 border p-2 rounded"
                        placeholder="Enter discount percentage"
                    />

                    <label className="block text-sm mb-1">Start Date (UTC)</label>
                    <input
                        type="datetime-local"
                        value={discountData.discountStartDate}
                        onChange={(e) => setDiscountData({ ...discountData, discountStartDate: e.target.value })}
                        className="w-full mb-2 border p-2 rounded"
                    />

                    <label className="block text-sm mb-1">End Date (UTC)</label>
                    <input
                        type="datetime-local"
                        value={discountData.discountEndDate}
                        onChange={(e) => setDiscountData({ ...discountData, discountEndDate: e.target.value })}
                        className="w-full mb-4 border p-2 rounded"
                    />

                    <div className="flex justify-end space-x-2">
                        <button
                            className="bg-gray-400 text-white px-4 py-2 rounded"
                            onClick={() => navigate('/listBook')} // Go back to the list of books
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                            onClick={handleDiscountSubmit}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimeDiscount;
