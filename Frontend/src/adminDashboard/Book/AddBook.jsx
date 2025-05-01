import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addBook, resetStatus } from '../../components/store/bookSlice';
import { STATUS } from '../../components/globals/status/status';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddBook = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector(state => state.book);

  const [bookData, setBookData] = useState({
    title: '',
    isbn: '',
    author: '',
    addedDate: '',
    publicationDate: '',
    isOnSale: false,
    price: '',
    genre: '',
    category: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookData({
      ...bookData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addBook(bookData));
  };

  useEffect(() => {
    if (status === STATUS.SUCCESS) {
      toast.success("Book added successfully!");
      navigate('/');
    } else if (status === STATUS.ERROR) {
      toast.error("Failed to add book.");
    }
  }, [status, dispatch, navigate]);

  return (
    <div className="max-w-4xl mx-auto p-8 mt-10 bg-white shadow-2xl rounded-3xl">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">📚 Add a New Book</h2>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input name="title" placeholder="Book Title" value={bookData.title} onChange={handleChange} className="form-input" required />
        <input name="isbn" placeholder="ISBN" value={bookData.isbn} onChange={handleChange} className="form-input" required />
        <input name="author" placeholder="Author" value={bookData.author} onChange={handleChange} className="form-input" required />
        <input name="price" type="number" placeholder="Price ($)" value={bookData.price} onChange={handleChange} className="form-input" required />
        <input name="addedDate" type="date" value={bookData.addedDate} onChange={handleChange} className="form-input" required />
        <input name="publicationDate" type="date" value={bookData.publicationDate} onChange={handleChange} className="form-input" required />
        <input name="genre" placeholder="Genre" value={bookData.genre} onChange={handleChange} className="form-input" required />
        <input name="category" placeholder="Category" value={bookData.category} onChange={handleChange} className="form-input" required />

        <div className="col-span-1 md:col-span-2">
          <textarea name="description" rows={4} placeholder="Book Description" value={bookData.description} onChange={handleChange} className="form-input resize-none w-full" required />
        </div>

        <div className="col-span-1 md:col-span-2 flex items-center gap-3">
          <input type="checkbox" name="isOnSale" checked={bookData.isOnSale} onChange={handleChange} className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black" />
          <label htmlFor="isOnSale" className="text-gray-700 font-medium">On Sale</label>
        </div>

        <button
          type="submit"
          className={`col-span-1 md:col-span-2 bg-black text-white py-3 px-6 rounded-xl font-semibold shadow-md transition duration-300 hover:bg-gray-800 `}
       
        >
         Add book
        </button>
      </form>
    </div>
  );
};

export default AddBook;
