import { apiSlice } from "../../app/api/apiSlice";
import { logOut, setCredentials } from "./authSlice";

// Define API endpoints for authentication
export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Login endpoint
    login: builder.mutation({
      query: (credential) => ({
        url: "/auth",
        method: "POST",
        body: { ...credential },
      }),
    }),
    // Logout endpoint
    sendLogout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      // Handling logout operation
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          // Uncomment the following lines if you need to access data from the query
          /* const { data } = */
          await queryFulfilled;
          //console.log(data);

          // Dispatch the logout action
          dispatch(logOut());

          // Delay the reset of API state by 1000 milliseconds (1 second)
          setTimeout(() => {
            // Reset API state after the delay
            dispatch(apiSlice.util.resetApiState());
          }, 1000);
        } catch (err) {
          console.log(err);
        }
      },
    }),

    // Refresh token endpoint
    refresh: builder.mutation({
      query: () => ({
        url: "/auth/refresh",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          // Wait for the query to be fulfilled and get the data
          const { data } = await queryFulfilled;

          // Log the data for debugging purposes
          //console.log(data);

          // Extract the accessToken from the data
          const { accessToken } = data;

          // Dispatch an action to set the new accessToken in the Redux state
          dispatch(setCredentials({ accessToken }));
        } catch (err) {
          // Handle errors that may occur during the refresh process
          console.error(err);
        }
      },
    }),
  }),
});

// Extract generated hooks from the auth API slice
export const { useLoginMutation, useSendLogoutMutation, useRefreshMutation } =
  authApiSlice;
