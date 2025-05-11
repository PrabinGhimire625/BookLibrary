import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLatestBooks } from '../../store/ReviewSlice';
import { Link } from 'react-router-dom';

const LatestBook = () => {
  const dispatch = useDispatch();
  const { latestBooks } = useSelector((state) => state.review);

  useEffect(() => {
    dispatch(getLatestBooks());
  }, [dispatch]);

  return (
    <div className="px-6 py-8">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6 flex items-center gap-2">
        🆕 Latest Books
      </h2>

      {latestBooks.length === 0 ? (
        <p className="text-gray-500">No latest books available.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {latestBooks.map((book) => (
            <Link
              to={`/singleBook/${book.id}`}
              key={book.id}
              className="bg-white rounded-2xl shadow hover:shadow-xl transition duration-300 p-4 flex flex-col items-center hover:scale-105 transform"
            >
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-28 h-32 object-cover rounded mb-4"
              />
              <div className="text-center space-y-1 w-full">
                <h3 className="text-sm font-semibold text-indigo-900 truncate">{book.title}</h3>
                <p className="text-xs text-gray-600 italic truncate">{book.author}</p>
                <p className="text-xs text-gray-500 truncate">{book.genre} • {book.category}</p>
                <p className="text-sm text-yellow-500 font-medium">
                  ⭐ {book.averageRating.toFixed(1)}
                </p>

                {book.isOnSale ? (
                  <>
                    <div className="flex justify-center items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400 line-through">
                        Rs.{book.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-green-700 font-bold">
                        Rs.{book.currentPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="mt-1">
                      <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                        {book.discountPercentage}% OFF
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-800 font-semibold mt-2">
                      Rs.{book.price.toFixed(2)}
                    </p>
                    <span className="bg-gray-100 text-gray-500 text-xs font-medium px-2 py-0.5 rounded-full">
                      Not on Sale
                    </span>
                  </>
                )}

              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default LatestBook;
