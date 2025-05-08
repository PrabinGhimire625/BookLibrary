import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from './../../globals/Navbar';
import Card from './../../globals/Card';
import ListAllBook from "../../../adminDashboard/Book/ListAllBook";
import TopRatedBook from "./TopRatedBook";
import LatestBook from "./LatestBook";
import HistoricalBook from "./HistoricalBook";
import RomanceBook from "./RomanceBook";

const Home = () => {

  return (
    <>
      <TopRatedBook />
      <LatestBook />
      <HistoricalBook />
      <RomanceBook />
    </>
  );
};

export default Home;