import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

// Create an entity adapter for notes with a sort comparer based on completion status
const notesAdapter = createEntityAdapter({
  sortComparer: (a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1,
});

// Set the initial state using the entity adapter
const initialState = notesAdapter.getInitialState();

// Inject API endpoints into the notesApiSlice
export const notesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Define a query endpoint to get notes
    getNotes: builder.query({
      query: () => ({
        url: "/notes",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        // Transform and normalize the response data using the entity adapter
        const loadedNotes = responseData.map((note) => {
          note.id = note._id;
          return note;
        });
        return notesAdapter.setAll(initialState, loadedNotes);
      },
      providesTags: (result, error, arg) => {
        // Provide tags for caching and invalidation
        if (result?.ids) {
          return [
            { type: "Note", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Note", id })),
          ];
        } else return [{ type: "Note", id: "LIST" }];
      },
    }),

    // Define mutation endpoints for adding, updating, and deleting notes
    addNewNote: builder.mutation({
      query: (initialNote) => ({
        url: "/notes",
        method: "POST",
        body: { ...initialNote },
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    updateNote: builder.mutation({
      query: (initialNote) => ({
        url: "notes",
        method: "PATCH",
        body: { ...initialNote },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),
    deleteNote: builder.mutation({
      query: ({ id }) => ({
        url: "notes",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),
  }),
});

// Destructure the generated hooks from notesApiSlice
export const {
  useGetNotesQuery,
  useAddNewNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApiSlice;

// Select the result object of the getNotes query
export const selectNotesResult = notesApiSlice.endpoints.getNotes.select();

// Create a memoized selector to retrieve notes data
const selectNotesData = createSelector(
  selectNotesResult,
  (notesResult) => notesResult.data // normalized state object with ids & entities
);

// Use getSelectors from the entity adapter to create selectors
export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectIds: selectNoteIds,
} = notesAdapter.getSelectors(
  (state) => selectNotesData(state) ?? initialState
);
