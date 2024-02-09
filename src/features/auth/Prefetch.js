import { store } from "../../app/store";
import { notesApiSlice } from "../notes/notesApiSlice";
import { usersApiSlice } from "../users/usersApiSlice";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const Prefetch = () => {
  useEffect(() => {
    // Dispatch a prefetch action to fetch notes
    store.dispatch(
      notesApiSlice.util.prefetch("getNotes", "notesList", { force: true })
    );

    // Dispatch a prefetch action to fetch users
    store.dispatch(
      usersApiSlice.util.prefetch("getUsers", "usersList", { force: true })
    );
  }, []); // Run this effect only once (on mount)

  return <Outlet />;
};

export default Prefetch;
