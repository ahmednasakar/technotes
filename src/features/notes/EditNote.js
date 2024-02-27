import { useParams } from "react-router-dom";
import EditNoteForm from "./EditNoteForm";
import { useGetNotesQuery } from "./notesApiSlice";
import { useGetUsersQuery } from "../users/usersApiSlice";
import useAuth from "../../hooks/useAuth";
import { PulseLoader } from "react-spinners";
import useTitle from "../../hooks/useTitle";

const EditNote = () => {
  useTitle("techNotes: Edit Note");

  // Extracting 'id' from the URL params
  const { id } = useParams();

  // Retrieving parameters
  const { username, isManager, isAdmin } = useAuth();

  // Destructure the 'note' from the result of the 'useGetNotesQuery' hook
  const { note } = useGetNotesQuery("notesList", {
    // Customize the data selection from the query result
    selectFromResult: ({ data }) => ({
      note: data?.entities[id],
    }),
  });

  // Destructure the 'users' from the result of the 'useGetUsersQuery' hook
  const { users } = useGetUsersQuery("usersList", {
    // Customize the data selection from the query result
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  if (!note || !users?.length) return <PulseLoader color={"FFF"} />;

  // Conditionally rendering the error message or EditNoteForm
  const content =
    !isManager && !isAdmin && note.username !== username ? (
      <p className="errmsg">No access</p>
    ) : (
      <EditNoteForm note={note} users={users} />
    );

  return content;
};

export default EditNote;
