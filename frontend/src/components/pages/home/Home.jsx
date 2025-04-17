import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from './../../globals/Navbar';
import Card from './../../globals/Card';

const Home = () => {
  const [books, setBooks] = useState([]);
  
  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:3000/book");
      if (response.status === 200) {
        setBooks(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };
  
  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <>
      <Navbar />
      
      {/* Hero Section with the provided image */}
      <div className="relative h-96 w-full overflow-hidden">
        <img 
          src="https://img.ctykit.com/cdn/co-boulder/images/tr:w-1800/boulder-book-store-2022.jpg" 
          alt="Bookstore interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Your Next Favorite Book</h1>
            <p className="text-xl mb-6">Explore our vast collection of books for every reader</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg text-lg transition duration-300">
              Browse Collection
            </button>
          </div>
        </div>
      </div>
      
      {/* Featured Books Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Featured Books</h2>
        
        {/* Category Filter (optional) */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-full">
            <button className="px-4 py-2 rounded-full bg-white text-gray-800 font-medium">All</button>
            <button className="px-4 py-2 rounded-full hover:bg-white text-gray-600">Fiction</button>
            <button className="px-4 py-2 rounded-full hover:bg-white text-gray-600">Non-Fiction</button>
            <button className="px-4 py-2 rounded-full hover:bg-white text-gray-600">Science</button>
            <button className="px-4 py-2 rounded-full hover:bg-white text-gray-600">Biography</button>
          </div>
        </div>
        
        {/* Books Grid */}
        {books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {books.map((book) => (
              <Card key={book._id || book.id} type={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Loading books...</p>
          </div>
        )}
      </div>
      
      {/* Call to Action Section */}
      <div className="bg-blue-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Join Our Reading Community</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Sign up to get personalized book recommendations, exclusive deals, and updates on new arrivals.
          </p>
          <div className="flex justify-center">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="px-4 py-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-r-lg transition duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;