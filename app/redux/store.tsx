import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slice";
import productReducer from "./productSlice";
import loginReducer from "./loginDataSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productReducer,
    loginData: loginReducer,
  },
});

// ✅ ADD THESE LINES
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;