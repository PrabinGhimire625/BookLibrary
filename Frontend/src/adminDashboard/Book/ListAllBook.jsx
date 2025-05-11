import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { deleteBook, listAllBook } from '../../components/store/bookSlice';
import Sidebar from '../sidebar/Sidebar';
import { ShoppingCart, Bookmark, Pencil, Trash2, Percent } from 'lucide-react';
import { toast } from 'react-toastify';


const ListAllBook = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, book } = useSelector((state) => state.book);

  useEffect(() => {
    dispatch(listAllBook());
  }, [dispatch]);


  const handleDelete = (id) => {
    if (id) {
      dispatch(deleteBook(id));
      toast.success("Book deleted")
    } else {
      toast.error("Book not deleted");
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 py-6 px-4 sm:px-6 md:px-8 lg:px-10 overflow-y-auto">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">All Books</h2>

        <div className="space-y-4">
          {book && book.length > 0 ? (
            book.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition flex flex-col sm:flex-row overflow-hidden h-36"
              >

                {/* Book Cover */}
                <div
                  className="cursor-pointer sm:w-24 md:w-28 flex-shrink-0"
                  onClick={() => navigate(`/editBook/${item.id}`)}
                >
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="h-28 w-full object-cover rounded-l-md"
                  />
                </div>

                {/* Book Details */}
                <div className="p-3 flex flex-col justify-between flex-grow relative">
                  <div className="p-4 rounded-md bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                    <h3 className="text-base font-semibold text-gray-900 truncate">{item.title}</h3>
                    <p className="text-sm text-purple-600 truncate mb-1">by {item.author}</p>

                    <p className="text-sm font-semibold text-gray-700 mt-1">Original: Rs. {item.price}</p>
                    <p className="text-sm font-semibold text-green-600 mt-0.5">Now: Rs. {item.currentPrice}</p>
                    <p className="text-sm font-semibold text-red-500 mt-0.5">Discount: {item.discountPercentage}%</p>

                    <p className="text-xs text-gray-500 mt-2 line-clamp-1">
                      {item.description || 'No description available.'}
                    </p>
                  </div>


                  {/* Action Icons */}
                  <div className="absolute top-2 right-3 flex items-center space-x-2">
                    <Link to={`/editBook/${item?.id}`}> <button className="text-blue-500 hover:text-blue-700">
                      <Pencil size={16} />
                    </button></Link>
                    {/* delete button */}
                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                    <Link to={`/timeDiscount/${item.id}`}>
                      <button className="text-green-600 hover:text-green-800">
                        <Percent size={16} />
                      </button>
                    </Link>
                  </div>
                </div>

              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No books available.</p>
          )}

        </div>
      </div>
    </div>
  );
};

export default ListAllBook;
