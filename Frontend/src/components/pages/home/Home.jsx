import React from "react";
import Navbar from './../../globals/Navbar';
import TopRatedBook from "./TopRatedBook";
import LatestBook from "./LatestBook";
import HistoricalBook from "./HistoricalBook";
import RomanceBook from "./RomanceBook";
import Footer from "../../globals/Footer";
import ActiveAnnouncement from "./ActiveAnnouncement";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="pt-16 px-4 md:px-8 max-w-screen-xl mx-auto">
        <ActiveAnnouncement/>
        <TopRatedBook />
        <LatestBook />
        <HistoricalBook />
        <RomanceBook />
      </div>
      <Footer/>
     
    </>
  );
};

export default Home;
