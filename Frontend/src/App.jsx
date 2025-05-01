import { Routes, Route } from 'react-router-dom';
import Login from './components/pages/auth/Login';
import Home from './components/pages/home/Home';
import Product from './components/pages/product/Product';
import Register from './components/pages/auth/Register';
import AboutUs from './components/pages/home/About';
import ContactUs from './components/pages/home/Contact';
import { Provider } from 'react-redux';
import store from "./components/store/store";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './adminDashboard/dashboard/Dashboard';
import AddBook from './adminDashboard/Book/AddBook';

function App() {
  return (
    <Provider store={store}>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Product />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />

        
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/addBook" element={<AddBook />} />
      </Routes>

    </Provider>
  );
}

export default App;
