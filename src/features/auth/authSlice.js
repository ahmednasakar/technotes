import { createSlice } from "@reduxjs/toolkit";

// Create an authentication slice
const authSlice = createSlice({
  name: "auth", // Slice name
  initialState: { token: null }, // Initial state
  reducers: {
    // Reducer to set authentication credentials
    setCredentials: (state, action) => {
      const { accessToken } = action.payload;
      state.token = accessToken;
    },

    // Reducer to log out and clear the token
    logOut: (state, action) => {
      state.token = null;
    },
  },
});

// Export the actions for use in components or middleware
export const { setCredentials, logOut } = authSlice.actions;

// Export the reducer to be used in the Redux store
export default authSlice.reducer;

// Select the current token from the auth state
export const selectCurrentToken = (state) => state.auth.token;
