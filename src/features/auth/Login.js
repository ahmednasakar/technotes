import { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";

import usePersist from "../../hooks/usePersist";

const Login = () => {
  // Refs for focusing on elements
  const userRef = useRef();
  const errRef = useRef();

  // State for form inputs and error message
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [persist, setPersist] = usePersist();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Login mutation hook
  const [login, { isLoading }] = useLoginMutation();

  // Focus on username input when the component mounts
  useEffect(() => {
    userRef.current.focus();
  }, []);

  // Clear error message when username or password changes
  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { accessToken } = await login({ username, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
      setUsername("");
      setPassword("");
      navigate("/dash");
    } catch (err) {
      if (!err.status) {
        setErrMsg("No Server Response");
      } else if (err.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg(err.data?.message);
      }
      errRef.current.focus();
    }
  };

  // Handle username input change
  const handleUserInput = (e) => setUsername(e.target.value);

  // Handle password input change
  const handlePwdInput = (e) => setPassword(e.target.value);

  // Handle toggle input change
  const handleToggle = () => setPersist((prev) => !prev);

  // Determine error class
  const errClass = errMsg ? "errmsg" : "offscreen";

  // Render loading message if login is in progress
  if (isLoading) return <p>Loading...</p>;

  // Main content of the Login component
  const content = (
    <section className="public">
      <header>
        <h1>Employee Login</h1>
      </header>
      <main className="login">
        {/* Display error message if exists */}
        <p ref={errRef} className={errClass} aria-live="assertive">
          {errMsg}
        </p>

        {/* Login form */}
        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username:</label>
          <input
            className="form__input"
            type="text"
            id="username"
            ref={userRef}
            value={username}
            onChange={handleUserInput}
            autoComplete="off"
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            className="form__input"
            type="password"
            id="password"
            onChange={handlePwdInput}
            value={password}
            required
          />
          <button className="form__submit-button">Sign In</button>

          <label htmlFor="persist" className="form__persist">
            <input
              type="checkbox"
              id="persist"
              className="form__checkbox"
              onChange={handleToggle}
              checked={persist}
            />
            Trust This Device
          </label>
        </form>
      </main>
      {/* Back to Home link */}
      <footer>
        <Link to="/">Back to Home</Link>
      </footer>
    </section>
  );

  return content;
};

export default Login;
