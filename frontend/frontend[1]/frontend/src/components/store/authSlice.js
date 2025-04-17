import { createSlice } from "@reduxjs/toolkit";
import { STATUS } from "../globals/components/enumStatus/Status";
import { API, APIAuthenticated } from "../http";
import axios from "axios";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    data: [],
    status: STATUS.LOADING,
    token: "",
    profile: ""
  },
  reducers: {
    setUserData(state, action) {
      state.data = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    resetStatus(state) {
      state.status = STATUS.LOADING;
    },
    setToken(state, action) {
      state.token = action.payload;
      console.log(state.token);
    },
    setProfile(state, action) {
      state.profile = action.payload;
    },
  },
});

export const {
  setUserData,
  setStatus,
  resetStatus,
  setToken,
  setProfile,
} = authSlice.actions;
export default authSlice.reducer;

//signup
export function register(data) {
  return async function registerUserThunk(dispatch) {
    dispatch(setStatus(STATUS.LOADING));
    try {
      const response = await API.post("/api/user/register", data);
      if (response.status === 200) {
        dispatch(setUserData(response.data.data)); // Store user data after registration
        dispatch(setStatus(STATUS.SUCCESS));
      } else {
        dispatch(setStatus(STATUS.ERROR));
      }
    } catch (err) {
      dispatch(setStatus(STATUS.ERROR));
    }
  };
}
