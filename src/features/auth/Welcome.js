import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Welcome = () => {
  // Destructuring values from the custom authentication hook (useAuth)
  const { username, isManager, isAdmin } = useAuth();

  // Get the current date and format it
  const currentDate = new Date();
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(currentDate);

  // JSX content for the Welcome section
  const content = (
    <section className="welcome">
      <p>{formattedDate}</p>
      <h1>Welcome {username}</h1> {/* Displays the current username */}
      {/* Links to view and add techNotes */}
      <p>
        <Link to="/dash/notes">View techNotes</Link>
      </p>
      <p>
        <Link to="/dash/notes/new">Add New techNotes</Link>
      </p>
      {/* Conditional rendering of links for viewing and adding User Settings */}
      {(isManager || isAdmin) && (
        <p>
          <Link to="/dash/users">View User Settings</Link>
        </p>
      )}
      {(isManager || isAdmin) && (
        <p>
          <Link to="/dash/users/new">Add New User</Link>
        </p>
      )}
    </section>
  );

  return content;
};

export default Welcome;
