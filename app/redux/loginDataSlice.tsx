import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 👉 User type
interface User {
  id?: number;
  name?: string;
  token?: string;
  [key: string]: unknown;
}

// 👉 State type
interface LoginState {
  loginUserData: User;
}

// 👉 Safe sessionStorage parser
const getInitialUserData = (): User => {
  try {
    const data = sessionStorage.getItem("loginUserData");
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

const initialState: LoginState = {
  loginUserData: getInitialUserData(),
};

const loginData = createSlice({
  name: "loginData",
  initialState,
  reducers: {
    setLoginUserData: (
      state: LoginState, // ✅ FIX HERE
      action: PayloadAction<User>
    ) => {
      state.loginUserData = action.payload;

      sessionStorage.setItem(
        "loginUserData",
        JSON.stringify(action.payload)
      );
    },

    clearLoginUserData: (state: LoginState) => { // ✅ FIX HERE
      state.loginUserData = {};
      sessionStorage.removeItem("loginUserData");
    },
  },
});

export const { setLoginUserData, clearLoginUserData } = loginData.actions;
export default loginData.reducer;