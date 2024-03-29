/* import { useEffect } from "react"; */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileCirclePlus,
  faFilePen,
  faUserGear,
  faUserPlus,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { PulseLoader } from "react-spinners";

import { useSendLogoutMutation } from "../features/auth/authApiSlice";

import useAuth from "../hooks/useAuth";

const DASH_REGEX = /^\/dash(\/)?$/;
const NOTES_REGEX = /^\/dash\/notes(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;

const DashHeader = () => {
  const { isManager, isAdmin } = useAuth();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [sendLogout, { isLoading, /* isSuccess, */ isError, error }] =
    useSendLogoutMutation();

  /* useEffect(() => {
    if (isSuccess) navigate("/");
  }, [isSuccess, navigate]); */

  const logOut = () => {
    sendLogout();
    navigate("/");
  };

  const onNewNoteClicked = () => navigate("/dash/notes/new");
  const onNewUserClicked = () => navigate("/dash/users/new");
  const onNotesClicked = () => navigate("/dash/notes");
  const onUsersClicked = () => navigate("/dash/users");

  const dashClass =
    !DASH_REGEX.test(pathname) &&
    !NOTES_REGEX.test(pathname) &&
    !USERS_REGEX.test(pathname)
      ? "dash-header__container--small"
      : null;

  const newNoteButton = NOTES_REGEX.test(pathname) ? (
    <button className="icon-button" title="New Note" onClick={onNewNoteClicked}>
      <FontAwesomeIcon icon={faFileCirclePlus} />
    </button>
  ) : null;

  const newUserButton = USERS_REGEX.test(pathname) ? (
    <button className="icon-button" title="New User" onClick={onNewUserClicked}>
      <FontAwesomeIcon icon={faUserPlus} />
    </button>
  ) : null;

  let userButton = null;
  if (isManager || isAdmin) {
    if (!USERS_REGEX.test(pathname) && pathname.includes("/dash")) {
      userButton = (
        <button className="icon-button" title="Users" onClick={onUsersClicked}>
          <FontAwesomeIcon icon={faUserGear} />
        </button>
      );
    }
  }

  let notesButton = null;
  if (!NOTES_REGEX.test(pathname) && pathname.includes("/dash")) {
    notesButton = (
      <button className="icon-button" title="Notes" onClick={onNotesClicked}>
        <FontAwesomeIcon icon={faFilePen} />
      </button>
    );
  }

  const logoutButton = (
    <button className="icon-button" title="Logout" onClick={logOut}>
      <FontAwesomeIcon icon={faRightFromBracket} />
    </button>
  );

  const errClass = isError ? "errmsg" : "offscreen";

  const buttonContent = isLoading ? (
    <PulseLoader color={"#FFF"} />
  ) : (
    <>
      {newNoteButton}
      {newUserButton}
      {notesButton}
      {userButton}
      {logoutButton}
    </>
  );

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <header className="dash-header">
        <div className={`dash-header__container ${dashClass}`}>
          <Link to="/dash">
            <h1 className="dash-header__title">techNotes</h1>
          </Link>
          <nav className="dash-header__nav">{buttonContent}</nav>
        </div>
      </header>
    </>
  );

  return content;
};

export default DashHeader;
