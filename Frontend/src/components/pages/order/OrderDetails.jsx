import React from 'react';

const OrderDetails = () => {
  return (
    <div className="py-1 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
      {/* Header */}
      <div className="flex justify-start item-start space-y-5 flex-col">
        <h1 className="text-1xl dark:text-white lg:text-2xl font-semibold leading-7 lg:leading-9 text-gray-600">
          Order 12345
        </h1>
        <p className="text-base dark:text-gray-300 font-medium leading-6 text-gray-600">
          01/01/2025
        </p>
      </div>

      {/* Main Content */}
      <div className="mt-10 flex flex-col xl:flex-row justify-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
        {/* Left Side */}
        <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
          {/* Order Items */}
          <div className="flex flex-col justify-start items-start dark:bg-gray-800 bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
            <p className="text-lg md:text-xl dark:text-white font-semibold leading-6 xl:leading-5 text-gray-800">
              My Order
            </p>

            {/* Product Row */}
            <div className="mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full">
              <div className="pb-4 md:pb-8 w-full md:w-40">
                <img
                  className="w-full hidden md:block"
                  src="http://localhost:3000/product.jpg"
                  alt="product"
                />
                <img className="w-full md:hidden" src="http://localhost:3000/product.jpg" alt="product" />
              </div>
              <div className="border-b border-gray-200 flex flex-col md:flex-row justify-between items-start w-full pb-8 space-y-4 md:space-y-0">
                <div className="w-full flex flex-col justify-start items-start space-y-8">
                  <h3 className="text-xl dark:text-white xl:text-2xl font-semibold leading-6 text-gray-800">
                    Product Name
                  </h3>
                </div>
                <div className="flex justify-between space-x-8 items-start w-full">
                  <p className="text-base dark:text-white xl:text-lg leading-6">Rs. 500</p>
                  <p className="text-base dark:text-white xl:text-lg leading-6 text-gray-800">Qty: 2</p>
                  <p className="text-base dark:text-white xl:text-lg font-semibold leading-6 text-gray-800">
                    Rs. 1000
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary and Shipping */}
          <div className="flex justify-center flex-col md:flex-row items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
            {/* Summary */}
            <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
              <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">Summary</h3>
              <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                <div className="flex justify-between items-center w-full">
                  <p className="text-base dark:text-white leading-4 text-gray-800">Payment Method</p>
                  <p className="text-base dark:text-gray-300 leading-4 text-gray-600">Credit Card</p>
                </div>
                <div className="flex justify-between items-center w-full">
                  <p className="text-base dark:text-white leading-4 text-gray-800">Payment Status</p>
                  <p className="text-base dark:text-gray-300 leading-4 text-gray-600">Paid</p>
                </div>
                <div className="flex justify-between items-center w-full">
                  <p className="text-base dark:text-white leading-4 text-gray-800">Order Status</p>
                  <p className="text-base dark:text-gray-300 leading-4 text-gray-600">Delivered</p>
                </div>
              </div>
              <div className="flex justify-between items-center w-full">
                <p className="text-base dark:text-white font-semibold leading-4 text-gray-800">Total</p>
                <p className="text-base dark:text-gray-300 font-semibold leading-4 text-gray-600">Rs. 1100</p>
              </div>
            </div>

            {/* Shipping */}
            <div className="flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
              <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">Shipping</h3>
              <div className="flex justify-between items-start w-full">
                <div className="flex justify-center items-center space-x-4">
                  <div className="w-8 h-8">
                    <img
                      className="w-full h-full"
                      alt="logo"
                      src="https://i.ibb.co/L8KSdNQ/image-3.png"
                    />
                  </div>
                  <div className="flex flex-col justify-start items-center">
                    <p className="text-lg leading-6 dark:text-white font-semibold text-gray-800">
                      Delivery Charge
                      <br />
                      <span className="font-normal">Delivery within 24 Hours</span>
                    </p>
                  </div>
                </div>
                <p className="text-lg font-semibold leading-6 dark:text-white text-gray-800">Rs 100</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Customer Info & Actions */}
        <div className="space-y-6 w-full xl:w-96">
          {/* Customer Info */}
          <div className="bg-gray-50 dark:bg-gray-800 flex flex-col px-4 py-6 md:p-6 xl:p-8" style={{ height: 'auto' }}>
            <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">Customer</h3>
            <div className="mt-6 space-y-4">
              <p className="text-base dark:text-white font-semibold leading-4 text-gray-800">
                Address: 123 Main Street
              </p>
              <p className="text-sm dark:text-gray-300 leading-5 text-gray-600">
                Phone: +91 9876543210
              </p>
            </div>
            {/* Action Buttons */}
            <div className="flex flex-col space-y-4 mt-6">
              <button className="dark:border-white dark:hover:bg-gray-900 dark:bg-transparent dark:text-white py-3 hover:bg-gray-200 border border-gray-800 w-full text-base leading-4 text-gray-800">
                Edit Order
              </button>
              <button className="dark:border-white dark:hover:bg-gray-900 dark:bg-transparent dark:text-white py-3 hover:bg-red-200 border border-gray-800 w-full text-base leading-4 text-gray-800">
                Cancel Order
              </button>
              <button className="py-3 border border-gray-800 w-full text-base leading-4" style={{ backgroundColor: 'red', color: 'white' }}>
                Delete Order
              </button>
            </div>
          </div>

          {/* Download Section */}
          <div className="bg-gray-50 dark:bg-gray-800 flex flex-col px-4 py-6 md:p-6 xl:p-8">
            <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">Download</h3>
            <div className="flex flex-col space-y-4 mt-6">
              <button className="dark:border-white dark:hover:bg-gray-900 dark:bg-transparent dark:text-white py-3 hover:bg-gray-200 border border-gray-800 w-full text-base leading-4 text-gray-800">
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
