"use client";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import store from "../redux/store";
import Header from "../Header/header";
import ProductList from "../productList";
import AllCartItems from "../cart/page";
import About from "../about/page";

const Dashboard = () => {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Header />
        <Routes>
          <Route path="/dashboard" element={<ProductList />} />
          <Route path="/allCartItems" element={<AllCartItems />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Provider>
    </BrowserRouter>
  );
};

export default Dashboard;