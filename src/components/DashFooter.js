import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const DashFooter = () => {
  // Destructuring values from the custom authentication hook (useAuth)
  const { username, status } = useAuth();

  // Get the navigation function and current pathname from React Router
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Function to handle the "Go Home" button click
  const onGoHomeClicked = () => navigate("/dash");

  // Conditionally render the "Go Home" button based on the current pathname
  const goHomeButton =
    pathname !== "/dash" ? (
      <button
        className="dash-footer__button icon-button"
        title="Home"
        onClick={onGoHomeClicked}
      >
        <FontAwesomeIcon icon={faHouse} />
      </button>
    ) : null;

  // JSX content for the DashFooter component
  const content = (
    <footer className="dash-footer">
      {goHomeButton}
      <p>Current User: {username}</p> {/* Displays the current username */}
      <p>Status: {status}</p>{" "}
      {/* Displays the current user status (e.g., Employee, Manager, Admin) */}
    </footer>
  );

  return content;
};

export default DashFooter;
