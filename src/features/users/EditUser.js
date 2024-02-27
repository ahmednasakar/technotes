import { useParams } from "react-router-dom";
import EditUserForm from "./EditUserForm";
import { useGetUsersQuery } from "./usersApiSlice";
import { PulseLoader } from "react-spinners";
import useTitle from "../../hooks/useTitle";

const EditUser = () => {
  useTitle("techNotes: Edit User");

  // Retrieving the "id" parameter from the route
  const { id } = useParams();

  // Destructure the 'user' from the result of the 'useGetUsersQuery' hook
  const { user } = useGetUsersQuery("usersList", {
    // Customize the data selection from the query result
    selectFromResult: ({ data }) => ({
      user: data?.entities[id],
    }),
  });

  // Conditionally rendering the loader or a EditUserForm
  const content = !user ? (
    <PulseLoader color={"#FFF"} />
  ) : (
    <EditUserForm user={user} />
  );

  return content;
};

export default EditUser;
