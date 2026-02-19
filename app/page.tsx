"use client";
import Header from "./Header/header";
import { Provider } from "react-redux";
import ProductList from "./productList";
import store from "./redux/store";
const App = () => {
  return (
    <>
      <Provider store={store}>
        <Header />
        <ProductList />
      </Provider>
    </>
  );
};

export default App;
