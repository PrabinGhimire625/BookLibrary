import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS } from '../../globals/status/status';
import { listAllWhiteList } from '../../store/whiteListSlice';
import { Link } from 'react-router-dom';
import Navbar from '../../globals/Navbar';
import Footer from '../../globals/Footer';

const WhiteList = () => {
  const dispatch = useDispatch();
  const { whiteList, status } = useSelector((state) => state.whiteList);

  useEffect(() => {
    dispatch(listAllWhiteList());
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <div className="pt-16 px-4 md:px-8 max-w-screen-xl mx-auto">
        <div className=" px-4 md:px-12 py-10 ">
          <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">My Whitelist</h2>

          {status === STATUS.LOADING && (
            <p className="text-center text-gray-600">Loading books...</p>
          )}

          {status === STATUS.ERROR && (
            <p className="text-center text-red-600">Something went wrong. Please try again.</p>
          )}

          {whiteList.length === 0 && status !== STATUS.LOADING ? (
            <p className="text-center text-gray-500 mt-10">No books in your whitelist yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {whiteList.map((item) => (
                <Link to={`/singleBook/${item.bookId}`} key={item.whiteListId}>
                  <div className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow duration-300 p-4 flex flex-col items-center w-72 mx-auto">
                    <img
                      src={item.coverImage}
                      alt={item.bookTitle}
                      className="w-36 h-40 object-cover rounded mb-4"
                    />
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-indigo-800">{item.bookTitle}</h3>
                      <p className="text-sm text-gray-600 italic">by {item.bookAuthor}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.genre} • {item.category}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default WhiteList;
