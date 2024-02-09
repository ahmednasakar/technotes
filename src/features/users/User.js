import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useGetUsersQuery } from "./usersApiSlice";
import { memo } from "react";

const User = ({ userId }) => {
  // Destructure the 'user' from the result of the 'useGetUsersQuery' hook
  const { user } = useGetUsersQuery("usersList", {
    // Customize the data selection from the query result
    selectFromResult: ({ data }) => ({
      user: data?.entities[userId],
    }),
  });

  // Use the useNavigate hook from react-router-dom for programmatic navigation
  const navigate = useNavigate();

  // Check if user data is available
  if (user) {
    // Handle edit button click by navigating to the user's edit page
    const handleEdit = () => navigate(`/dash/users/${userId}`);

    // Convert user roles array to a string for display
    const userRolesString = user.roles.toString().replaceAll(",", ", ");

    // Determine cell status based on user's active status
    const cellStatus = user.active ? "" : "table__cell--inactive";

    // Render the user row with cells containing user details
    return (
      <tr className={`table__row user ${cellStatus}`}>
        <td className="table__cell">{user.username}</td>
        <td className="table__cell">{userRolesString}</td>
        <td className="table__cell">
          {/* Edit button with FontAwesome icon */}
          <button className="icon-button table__button" onClick={handleEdit}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>
      </tr>
    );
  } else {
    // If user data is not available, return null to render nothing
    return null;
  }
};

// Memoize the 'User' component
const memoizedUser = memo(User);

export default memoizedUser;
