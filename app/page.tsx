"use client";
import { Provider } from "react-redux";
import store from "./redux/store";
import AuthPage from "./login.tsx/page";
const App = () => {
  return (
    <>
        <Provider store={store}>
          <AuthPage/>
        </Provider>
    </>
  );
};

export default App;
