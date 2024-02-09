import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import { jwtDecode } from "jwt-decode";

// Custom hook for retrieving and decoding authentication information
const useAuth = () => {
  // Retrieve the current authentication token from the Redux store
  const token = useSelector(selectCurrentToken);

  // Initialize default values
  let isManager = false;
  let isAdmin = false;
  let status = "Employee";

  // Check if a token is present
  if (token) {
    // Decode the JWT token
    const decoded = jwtDecode(token);
    const { username, roles } = decoded.UserInfo;

    // Update values based on user roles
    isManager = roles.includes("Manager");
    isAdmin = roles.includes("Admin");

    // Update status based on user roles
    if (isManager) status = "Manager";
    if (isAdmin) status = "Admin";

    // Return authentication information
    return { username, roles, status, isManager, isAdmin };
  }

  // Return default values when no token is present
  return { username: "", roles: [], isManager, isAdmin, status };
};

export default useAuth;
