import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Link } from 'react-router-dom';
import { getLatestRomanceBooks } from '../../store/ReviewSlice';

const RomanceBook = () => {
  const dispatch = useDispatch();
  const { latestRomanceBooks } = useSelector((state) => state.review);

  useEffect(() => {
    dispatch(getLatestRomanceBooks());
  }, [dispatch]);

  return (
    <div className="px-6 py-8">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">
      ❤️ Romance
      </h2>

      {latestRomanceBooks.length === 0 ? (
        <p className="text-gray-500">No latest books available.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {latestRomanceBooks.map((book) => (
            <Link
              to={`/singleBook/${book.id}`}
              key={book.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-3 flex flex-col items-center cursor-pointer hover:scale-[1.02] transform transition-transform"
            >
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-24 h-28 object-cover rounded mb-2"
              />
              <div className="text-center">
                <h3 className="text-sm font-semibold text-indigo-800 truncate w-32">
                  {book.title}
                </h3>
                <p className="text-xs text-gray-600 italic truncate w-32">
                  {book.author}
                </p>
                <p className="text-xs text-gray-500 truncate w-32">
                  {book.genre} • {book.category}
                </p>
                <p className="text-sm text-yellow-500 font-medium">
                  ⭐ {book.averageRating.toFixed(1)}
                </p>
                <p className="text-sm text-green-600 font-semibold">
                  {book.isOnSale ? `₹${book.price}` : 'Not for Sale'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RomanceBook;
