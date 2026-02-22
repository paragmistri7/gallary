import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
  items: localStorage?.getItem("cartItems")
    ? JSON.parse(localStorage?.getItem("cartItems"))
    : [],
};

const addToCart = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      state.items = action?.payload;
      localStorage?.setItem("cartItems", JSON.stringify(state.items));
    },
    addCartItem: (state, action) => {
      state.items?.push(action.payload);
      localStorage?.setItem("cartItems", JSON.stringify(state.items));
    },
    removeCartItem: (state, action) => {
      state.items = state.items?.filter(
        (item) => item?.id !== action.payload?.id,
      );
      localStorage?.setItem("cartItems", JSON.stringify(state.items));
    },
    clearCartItem: (state, action) => {
      state.items = [];
      localStorage?.removeItem("cartItems");
    },
  },
});

export const { addItem, addCartItem, removeCartItem, clearCartItem } =
  addToCart?.actions;
export default addToCart?.reducer;
