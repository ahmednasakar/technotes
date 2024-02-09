import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "../features/auth/authSlice";

// Configure the Redux store
export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer, // Combine the API slice reducer
    auth: authReducer, // Add the authentication reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware), // Add middleware for API queries
  devTools: false, // Enable Redux DevTools extension
});

// Setup listeners for automatic query result handling
setupListeners(store.dispatch);
