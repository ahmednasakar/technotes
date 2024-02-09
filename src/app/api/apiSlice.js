import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "../../features/auth/authSlice";

// Configure the base query for making API requests
const baseQuery = fetchBaseQuery({
  baseUrl: "https://technotes-api.onrender.com", // Base URL for the API
  credentials: "include", // Include credentials for cross-origin requests
  prepareHeaders: (headers, { getState }) => {
    // Retrieve the authentication token from the Redux state
    const token = getState().auth.token;

    // Set the "authorization" header with the bearer token if available
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

// Define a custom function for handling reauthentication
const baseQueryWithReauth = async (args, api, extraOptions) => {
  // Logging for debugging purposes
  // console.log(args); // Request URL, method, body
  // console.log(api); // Signal, dispatch, getState()
  // console.log(extraOptions); // Custom options like { shout: true }

  let result = await baseQuery(args, api, extraOptions);

  // If the request returns a 403 status code (Forbidden)
  if (result?.error?.status === 403) {
    console.log("Sending refresh token");

    // Send a refresh token to obtain a new access token
    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

    if (refreshResult?.data) {
      // Store the new token in the Redux state
      api.dispatch(setCredentials({ ...refreshResult.data }));

      // Retry the original query with the new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Handle the case when the refresh token request fails
      if (refreshResult?.error?.status === 403) {
        refreshResult.error.data.message = "Your login has expired.";
      }
      return refreshResult;
    }
  }

  return result;
};

// Create an API slice using createApi
export const apiSlice = createApi({
  // Configure the base query with the API's base URL and reauthentication logic
  baseQuery: baseQueryWithReauth,

  // Define custom tag types for entities (optional)
  tagTypes: ["Note", "User"],

  // Define API endpoints using the builder (to be filled with actual endpoints)
  endpoints: (builder) => ({}),
});
