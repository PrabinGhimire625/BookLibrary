import React from "react";

const products = [
  {
    title: "Never Again: Testimonies from the...",
    author: "Kunda Again",
    price: 2500,
    image: "https://via.placeholder.com/150x220?text=Book+1",
  },
  {
    title: "Buddhist worlds",
    author: "Sergio Ardissone",
    price: 3100,
    image: "https://via.placeholder.com/150x220?text=Book+2",
  },
  {
    title: "photographing plants and gardens",
    author: "Clive Nichols",
    price: 960,
    image: "https://via.placeholder.com/150x220?text=Book+3",
  },
  {
    title: "The Icelandic Voyage",
    author: "Amit Gupta",
    price: 784,
    image: "https://via.placeholder.com/150x220?text=Book+4",
  },
  {
    title: "The Rough Guide to Jimi Hendrix",
    author: "Richie Unterberger",
    price: 1440,
    image: "https://via.placeholder.com/150x220?text=Book+5",
  },
];

export default function ProductPage() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {products.map((product, index) => (
          <div key={index} className="bg-white shadow-md rounded-xl overflow-hidden">
            <img src={product.image} alt={product.title} className="w-full h-56 object-cover" />
            <div className="p-4">
              <h3 className="text-md font-semibold leading-tight text-gray-900 truncate">
                {product.title}
              </h3>
              <p className="text-sm text-gray-600 mb-1">by {product.author}</p>
              <p className="text-lg font-bold text-gray-800 mb-3">Rs. {product.price}</p>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md">
                ADD TO CART
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
