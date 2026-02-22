"use client";
import Header from "./Header/header";
import { Provider } from "react-redux";
import ProductList from "./productList";
import AllCartItems from "./cart/page";
import store from "./redux/store";
import { BrowserRouter, Route, Routes } from "react-router-dom";
const App = () => {
  return (
    <>
      <BrowserRouter>
        <Provider store={store}>
          <Header />
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/allCartItems" element={<AllCartItems />} />
          </Routes>
        </Provider>
      </BrowserRouter>
    </>
  );
};

export default App;
