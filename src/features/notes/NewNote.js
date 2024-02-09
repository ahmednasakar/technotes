import NewNoteForm from "./NewNoteForm";
import { useGetUsersQuery } from "../users/usersApiSlice";
import { PulseLoader } from "react-spinners";

const NewNote = () => {
  // Destructure the 'users' from the result of the 'useGetUsersQuery' hook
  const { users } = useGetUsersQuery("usersList", {
    // Customize the data selection from the query result
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  // Render a message if no users are available
  if (!users?.length) return <PulseLoader color={"#FFF"} />;

  // Render the NewNoteForm component with the selected users
  const content = <NewNoteForm users={users} />;

  return content;
};

export default NewNote;
