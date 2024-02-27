import { useGetUsersQuery } from "./usersApiSlice";
import User from "./User";
import useTitle from "../../hooks/useTitle";
import { PulseLoader } from "react-spinners";

const UsersList = () => {
  useTitle("techNotes: Users List");

  // Fetch users data using the useGetUsersQuery hook
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery("usersList", {
    pollingInterval: 60000, // Poll for new data every 60 seconds
    refetchOnFocus: true, // Refetch data when the component is focused
    refetchOnMountOrArgChange: true, // Refetch data when the component mounts or when arguments change
  });

  // Initialize content variable
  let content;

  // Show loading message while data is being fetched
  if (isLoading) content = <PulseLoader color={"#FFF"} />;

  // Show error message if there is an error
  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  // If data fetching is successful, render the user table
  if (isSuccess) {
    const { ids } = users;

    // Generate content for each user in the table
    const tableContent =
      ids?.length && ids.map((userId) => <User key={userId} userId={userId} />);

    // Render the user table with headers and content
    content = (
      <table className="table table--users">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th user__username">
              Username
            </th>
            <th scope="col" className="table__th user__roles">
              Roles
            </th>
            <th scope="col" className="table__th user__edit">
              Edit
            </th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    );
  }

  return content;
};

export default UsersList;
