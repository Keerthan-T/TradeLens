import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './index.css';
import HomePage from './LandingPage/Home/homePage.js';

import Navbar from './LandingPage/navbar.js';
import Footer from './LandingPage/footer.js';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
  <Navbar/>
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
    <Footer/>

  </BrowserRouter>
);
