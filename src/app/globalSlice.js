import { createSlice } from "@reduxjs/toolkit";
import { persistedState } from "redux-persist";

const initialState = {
  type: 0,
  login: false,
  username: "",
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    handleLogin: (state) => {
      console.log("我执行了");
      state.login = true;
    },
    handleLogout: (state) => {
      state.login = false;
    },
    setType: (state, action) => {
      state.type = action.payload;
    },
    setName: (state, action) => {
      state.username = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { handleLogin, handleLogout, setType,setName } = globalSlice.actions;

export default globalSlice.reducer;
