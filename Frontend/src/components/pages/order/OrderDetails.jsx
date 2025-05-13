import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSingleOrder, cancelOrder } from '../../store/orderSlice';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { STATUS } from '../../globals/status/status';
import Navbar from '../../globals/Navbar';
import Footer from '../../globals/Footer';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { singleOrder, status } = useSelector((state) => state.order);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleOrder(id));
    }
  }, [dispatch, id]);

  const handleCancelOrder = async () => {
    setLoading(true);
    await dispatch(cancelOrder(id));
    setLoading(false);

    if (status === STATUS.SUCCESS) {
      toast.success('Order canceled successfully');
      navigate('/myOrder');
    } else if (status === STATUS.ERROR) {
      toast.error('Failed to cancel order');
    }
  };
const handleDownloadInvoice = () => {
  if (!singleOrder) return;

  let invoiceText = `========================================\n`;
  invoiceText += `                 INVOICE                \n`;
  invoiceText += `========================================\n\n`;
  invoiceText += `Order ID      : ${singleOrder.orderId}\n`;
  invoiceText += `Order Date    : ${new Date(singleOrder.orderDate).toLocaleDateString()}\n`;
  invoiceText += `Status        : ${singleOrder.status}\n\n`;

  invoiceText += `----------------------------------------\n`;
  invoiceText += `Items:\n`;
  invoiceText += `----------------------------------------\n`;

  singleOrder.items?.forEach((item, index) => {
    invoiceText += `\n${index + 1}. ${item.bookTitle}\n`;
    invoiceText += `   Category       : ${item.category}\n`;
    invoiceText += `   Quantity       : ${item.quantity}\n`;
    invoiceText += `   Price per Unit : Rs. ${item.pricePerUnit.toFixed(2)}\n`;
    invoiceText += `   Total          : Rs. ${(item.quantity * item.pricePerUnit).toFixed(2)}\n`;
  });

  invoiceText += `\n----------------------------------------\n`;

  // Ensure totalPrice is a number before calling toFixed
  const totalPrice = Number(singleOrder.totalPrice);
  if (!isNaN(totalPrice)) {
    invoiceText += `Total Amount  : Rs. ${totalPrice.toFixed(2)}\n`;
  } else {
    invoiceText += `Total Amount  : Rs. 0.00\n`; // Default value if totalPrice is not a valid number
  }

  invoiceText += `========================================\n`;
  invoiceText += `        Thank you for your purchase!     \n`;
  invoiceText += `========================================\n`;

  const blob = new Blob([invoiceText], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Invoice_${singleOrder.orderId}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


  return (
    <>
      <Navbar />
      <div className="pt-16 px-4 md:px-8 max-w-screen-xl mx-auto">
        <div className="min-h-screen py-10 px-6 md:px-16 bg-gray-50 text-black">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="bg-white shadow rounded-lg p-6">
              <h1 className="text-2xl font-semibold">
                Order #{singleOrder?.orderId}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Thank you for your purchase on{' '}
                {new Date(singleOrder?.orderDate).toLocaleDateString()}.
              </p>
            </div>

            {/* Order Items */}
            <div className="bg-white shadow rounded-lg p-6 space-y-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              {singleOrder?.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row items-start md:items-center gap-6 bg-white border border-gray-200 shadow-sm rounded-xl p-5 transition hover:shadow-md"
                >
                  {/* Book Image */}
                  <div className="w-full md:w-28 h-40 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50">
                    <img
                      src={item.coverImage}
                      alt={item.bookTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Book Info */}
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-bold text-gray-800">{item.bookTitle}</h3>
                    <p className="text-sm text-gray-600">Category: {item.category}</p>
                    <div className="flex flex-wrap items-center gap-6 mt-2">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Price:</span> Rs. {item.pricePerUnit}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Qty:</span> {item.quantity}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Total:</span> Rs. {item.pricePerUnit * item.quantity}
                      </p>
                    </div>
                  </div>

                  {/* Review Button */}
                  {singleOrder?.status === 'Delivered' && (
                    <div className="mt-4 md:mt-0 md:self-center">
                      <button
                        onClick={() => navigate(`/review/${item.bookId}`)}
                        className="inline-block px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                      >
                        Write a Review
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Summary & Actions */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Order Info */}
              <div className="bg-white shadow rounded-lg p-6 flex-1">
                <h2 className="text-xl font-semibold mb-4">Order Info</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Status</span>
                    <span className="font-medium">{singleOrder?.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total (Estimate)</span>
                    <span className="font-semibold">Rs. {singleOrder?.totalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Actions & Invoice */}
              <div className="bg-white shadow rounded-lg p-6 w-full lg:w-80 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Actions</h2>
                  {singleOrder?.status === 'Pending' && (
                    <button
                      onClick={handleCancelOrder}
                      className={`w-full text-center py-2 border rounded-lg text-red-600 hover:bg-red-100 transition ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={loading}
                    >
                      {loading ? 'Canceling...' : 'Cancel Order'}
                    </button>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-4">Invoice</h2>
                  <button
                    onClick={handleDownloadInvoice}
                    className="w-full text-center py-2 border rounded-lg hover:bg-gray-100 transition"
                  >
                    Download Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
      <Footer />
    </>
  );
};

export default OrderDetails;
