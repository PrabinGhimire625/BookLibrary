import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addBook } from '../../components/store/bookSlice';
import { STATUS } from '../../components/globals/status/status';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import { listAllCategory } from '../../components/store/categorySlice';
import { listAllGenre } from '../../components/store/genreSlice';

const AddBook = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector(state => state.book);
  const { genre } = useSelector(state => state.genre);
  const { category } = useSelector(state => state.category);

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
    coverImage: '',
    stock: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Validate price and stock to only accept positive numbers
    if ((name === 'price' || name === 'stock') && value < 0) {
      return;
    }

    setBookData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addBook(bookData));
    if (status === STATUS.SUCCESS) {
      toast.success("Book added successfully!");
      navigate('/listBook');
    } else if (status === STATUS.ERROR) {
      toast.error("Failed to add book.");
    }
  };

  useEffect(() => {
    dispatch(listAllCategory());
    dispatch(listAllGenre());
  }, [dispatch]);

  console.log("Genre", genre);
  console.log("Category", category);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Content Area */}
      <div className="w-full md:w-3/4 p-4 sm:p-6 md:p-8 bg-gray-50">
        <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-6 md:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">📚 Add New Book</h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Image Upload */}
            <div className="col-span-1 flex flex-col items-center gap-3">
              <p className="text-sm text-gray-500">Cover Image</p>
              {bookData.coverImage ? (
                <img
                  src={bookData.coverImage}
                  alt="Cover Preview"
                  onClick={handleImageUpload}
                  className="w-48 h-48 sm:w-64 sm:h-64 object-cover rounded-xl shadow cursor-pointer hover:ring-4 hover:ring-gray-400 transition duration-300"
                  title="Click to replace image"
                />
              ) : (
                <div
                  onClick={handleImageUpload}
                  className="w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center border-2 border-dashed border-gray-400 text-gray-500 cursor-pointer rounded-xl hover:border-black transition"
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
              <Input name="price" type="number" label="Price (Rs)" value={bookData.price} onChange={handleChange} requiredmin="0" />

              <Input name="addedDate" type="date" label="Added Date" value={bookData.addedDate} onChange={handleChange} required />
              <Input name="publicationDate" type="date" label="Publication Date" value={bookData.publicationDate} onChange={handleChange} required />

              {/* Genre Dropdown */}
              <div>
                <label htmlFor="genre" className="block text-gray-700 font-semibold mb-1">Genre</label>
                <select
                  name="genre"
                  id="genre"
                  value={bookData.genre}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                  required
                >
                  <option value="">Select Genre</option>
                  {genre.map((g) => (
                    <option key={g.genreId} value={g.genreName}>
                      {g.genreName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Dropdown */}
              <div>
                <label htmlFor="category" className="block text-gray-700 font-semibold mb-1">Category</label>
                <select
                  name="category"
                  id="category"
                  value={bookData.category}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                  required
                >
                  <option value="">Select Category</option>
                  {category.map((cat) => (
                    <option key={cat.id} value={cat.categoryName}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                name="stock"
                type="number"
                label="Stock"
                value={bookData.stock}
                onChange={handleChange}
                required
                min="0" 
              />
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
                ➕ Add Book
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

export default AddBook;
