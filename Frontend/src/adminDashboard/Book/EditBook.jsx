import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { updateBook } from '../../components/store/bookSlice';
import { toast } from 'react-toastify';
import Sidebar from '../sidebar/Sidebar';

const EditBookForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { book } = useSelector((state) => state.book);
  const selectedBook = book.find((item) => item.id === id);

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
    description: '',
    coverImage: ''
  });

  useEffect(() => {
    if (selectedBook) {
      setBookData({
        title: selectedBook.title || '',
        isbn: selectedBook.isbn || '',
        author: selectedBook.author || '',
        addedDate: selectedBook.addedDate?.slice(0, 10) || '',
        publicationDate: selectedBook.publicationDate?.slice(0, 10) || '',
        isOnSale: selectedBook.isOnSale || false,
        price: selectedBook.price || '',
        genre: selectedBook.genre || '',
        category: selectedBook.category || '',
        description: selectedBook.description || '',
        coverImage: selectedBook.coverImage || ''
      });
    }
  }, [selectedBook]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateBook({ id, bookData }));
    toast.success("Book updated successfully!");
    navigate('/listBook');
  };

  const handleImageUpload = () => {
    window.cloudinary.openUploadWidget(
      {
        cloudName: import.meta.env.VITE_CLOUD_NAME,
        uploadPreset: import.meta.env.VITE_CLOUD_PRESET,
        cropping: true,
        multiple: false,
        maxFileSize: 10000000,
        folder: 'books',
        sources: ['local', 'url', 'camera'],
        showAdvancedOptions: true
      },
      (error, result) => {
        if (result && result.event === 'success') {
          setBookData(prev => ({
            ...prev,
            coverImage: result.info.secure_url
          }));
        }
      }
    );
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Content Area */}
      <div className="w-full md:w-3/4 p-4 sm:p-6 md:p-8 bg-gray-50">
        <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-6 md:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">✏️ Edit Book</h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Image Upload */}
            <div className="col-span-1 flex flex-col items-center gap-3">
              <p className="text-sm text-gray-500">Cover Image</p>
              {bookData.coverImage ? (
                <img
                  src={bookData.coverImage}
                  alt="Cover Preview"
                  onClick={handleImageUpload}
                  className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-xl shadow cursor-pointer hover:ring-4 hover:ring-gray-400 transition duration-300"
                  title="Click to replace image"
                />
              ) : (
                <div
                  onClick={handleImageUpload}
                  className="w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center border-2 border-dashed border-gray-400 text-gray-500 cursor-pointer rounded-xl hover:border-black transition"
                >
                  Click to Upload
                </div>
              )}
            </div>

            {/* Input Fields */}
            <div className="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input name="title" label="Book Title" value={bookData.title} onChange={handleChange} required />
              <Input name="isbn" label="ISBN" value={bookData.isbn} onChange={handleChange} required />
              <Input name="author" label="Author" value={bookData.author} onChange={handleChange} required />
              <Input name="price" type="number" label="Price (Rs)" value={bookData.price} onChange={handleChange} required />
              <Input name="addedDate" type="date" label="Added Date" value={bookData.addedDate} onChange={handleChange} required />
              <Input name="publicationDate" type="date" label="Publication Date" value={bookData.publicationDate} onChange={handleChange} required />
              <Input name="genre" label="Genre" value={bookData.genre} onChange={handleChange} required />
              <Input name="category" label="Category" value={bookData.category} onChange={handleChange} required />
            </div>

            {/* Description & Sale Checkbox */}
            <div className="col-span-1 lg:col-span-3">
              <label className="block text-gray-700 font-semibold mb-1">Description</label>
              <textarea
                name="description"
                rows={4}
                value={bookData.description}
                onChange={handleChange}
                placeholder="Write a short description..."
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black resize-none"
                required
              />
            </div>

            <div className="col-span-1 lg:col-span-3 flex items-center gap-3">
              <input
                type="checkbox"
                name="isOnSale"
                checked={bookData.isOnSale}
                onChange={handleChange}
                className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black"
              />
              <label htmlFor="isOnSale" className="text-gray-700 font-medium">Is this book on sale?</label>
            </div>

            <div className="col-span-1 lg:col-span-3 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto bg-black hover:bg-gray-800 text-white py-3 px-6 rounded-xl font-medium shadow-lg transition duration-300"
              >
                Update Book
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Input component
const Input = ({ name, type = 'text', label, value, onChange, required = false }) => (
  <div>
    <label htmlFor={name} className="block text-gray-700 font-semibold mb-1">{label}</label>
    <input
      name={name}
      id={name}
      type={type}
      value={value}
      onChange={onChange}
      className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
      required={required}
    />
  </div>
);

export default EditBookForm;
