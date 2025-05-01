import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from './../../globals/Navbar';
import Card from './../../globals/Card';

const Home = () => {
  // const [books, setBooks] = useState([]);
  
  // // const fetchBooks = async () => {
  // //   try {
  // //     const response = await axios.get("http://localhost:3000/book");
  // //     if (response.status === 200) {
  // //       setBooks(response.data.data);
  // //     }
  // //   } catch (error) {
  // //     console.error("Error fetching books:", error);
  // //   }
  // // };
  
  // // useEffect(() => {
  // //   fetchBooks();
  // // }, []);

  return (
    <>
      <Navbar />
      
   
    </>
  );
};

export default Home;