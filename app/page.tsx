"use client";
import { Provider } from "react-redux";
import store from "./redux/store";
import { BrowserRouter } from "react-router-dom";
import AuthPage from "./login.tsx/page";
const App = () => {
  return (
    <>
      <BrowserRouter>
        <Provider store={store}>
          <AuthPage/>
        </Provider>
      </BrowserRouter>
    </>
  );
};

export default App;
