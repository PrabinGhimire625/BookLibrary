import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSingleOrder, cancelOrder } from '../../store/orderSlice'; // Import cancelOrder
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { STATUS } from '../../globals/status/status';

const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { singleOrder, status } = useSelector((state) => state.order); // Use status for cancel status
  const [loading, setLoading] = useState(false); // Track loading state for cancellation

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleOrder(id));
    }
  }, [dispatch, id]);

  const handleCancelOrder = () => {
    setLoading(true); // Set loading to true when canceling
    dispatch(cancelOrder(id));
     if (status === STATUS.SUCCESS) {
          toast.success("Book added successfully!");
          navigate('/listBook');
        } else if (status === STATUS.ERROR) {
          toast.error("Failed to add book.");
        }
    
  };

  return (
    <div className="py-1 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto bg-white text-black">
      <div className="flex justify-start item-start space-y-5 flex-col">
        <h1 className="text-1xl lg:text-2xl font-semibold leading-7 lg:leading-9">
          Order #{singleOrder?.orderId}
        </h1>
        <p className="text-base font-medium leading-6 text-gray-600">
          Thank you for your purchase on {new Date(singleOrder?.orderDate).toLocaleDateString()}.
        </p>
      </div>

      <div className="mt-10 flex flex-col xl:flex-row justify-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
        <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
          <div className="flex flex-col justify-start items-start bg-white px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full border border-gray-200">
            <p className="text-lg md:text-xl font-semibold leading-6 xl:leading-5 text-black">
              My Order
            </p>

            {singleOrder?.items?.map((item, index) => (
              <div
                key={index}
                className="mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full"
              >
                <div className="border-b border-gray-200 flex flex-col md:flex-row justify-between items-start w-full pb-8 space-y-4 md:space-y-0">
                  <div className="w-full flex flex-col justify-start items-start space-y-2">
                    <h3 className="text-xl xl:text-2xl font-semibold leading-6 text-black">
                      {item.coverImage}
                    </h3>
                    <h3 className="text-xl xl:text-2xl font-semibold leading-6 text-black">
                      {item.bookTitle}
                    </h3>
                  </div>
                  <div className="flex justify-between space-x-8 items-start w-full">
                    <p className="text-base xl:text-lg leading-6 text-black">
                      Rs. {item.pricePerUnit}
                    </p>
                    <p className="text-base xl:text-lg leading-6 text-black">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-base xl:text-lg font-semibold leading-6 text-black">
                      Rs. {item.pricePerUnit * item.quantity}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center flex-col md:flex-row items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
            <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-white border border-gray-200 space-y-6">
              <h3 className="text-xl font-semibold leading-5 text-black">Summary</h3>
              <div className="flex justify-between items-center w-full border-gray-200 border-b pb-4">
                <p className="text-base leading-4 text-black">Order Status</p>
                <p className="text-base leading-4 text-gray-600">{singleOrder?.status}</p>
              </div>
              <div className="flex justify-between items-center w-full pt-4">
                <p className="text-base font-semibold leading-4 text-black">Total (Estimate)</p>
                <p className="text-base font-semibold leading-4 text-gray-600">
                  Rs. {
                    singleOrder?.items?.reduce(
                      (acc, item) => acc + item.pricePerUnit * item.quantity,
                      0
                    )
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-6 w-full xl:w-96">
          <div className="bg-white border border-gray-200 flex flex-col px-4 py-6 md:p-6 xl:p-8">
            <h3 className="text-xl font-semibold leading-5 text-black">Customer</h3>
            <p className="text-base mt-4 text-gray-600">No customer data provided</p>
          </div>

          <div className="bg-white border border-gray-200 flex flex-col px-4 py-6 md:p-6 xl:p-8">
            <h3 className="text-xl font-semibold leading-5 text-black">Actions</h3>
            <div className="flex flex-col space-y-4 mt-6">
              <button className="py-3 hover:bg-gray-100 border border-black w-full text-base leading-4 text-black">
                Edit Order
              </button>
              <button
                onClick={handleCancelOrder}
                className="py-3 hover:bg-red-100 border border-black w-full text-base leading-4 text-red-600"
                disabled={loading} // Disable the button when loading
              >
                {loading ? 'Canceling...' : 'Cancel Order'}
              </button>
              <button className="py-3 border border-black w-full text-base leading-4 bg-red-600 text-white">
                Delete Order
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 flex flex-col px-4 py-6 md:p-6 xl:p-8">
            <h3 className="text-xl font-semibold leading-5 text-black">Download</h3>
            <div className="flex flex-col space-y-4 mt-6">
              <button className="py-3 hover:bg-gray-100 border border-black w-full text-base leading-4 text-black">
                Download Order Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
