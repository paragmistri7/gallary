import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
  cartValue: 0,
};

const addToCart = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state) => {
      console.log(state);
      state.value += 1;
    },
    removeItem: (state) => {
      console.log(state);
      state.value > 0 ? (state.value -= 1) : null;
    },
    addCartItem: (state) => {
      console.log(state);
      state.cartValue += 1;
    },
    clearItem: (state) => {
      console.log(state);
      state.cartValue = 0;
    },
  },
});

export const { addItem, removeItem, clearItem, addCartItem } =
  addToCart?.actions;
export default addToCart?.reducer;
