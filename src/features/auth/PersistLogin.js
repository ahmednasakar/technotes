import { Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";

const PersistLogin = () => {
  const [persist] = usePersist();
  const token = useSelector(selectCurrentToken);
  const effectRan = useRef(false);

  const [trueSuccess, setTrueSuccess] = useState(false);

  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
    useRefreshMutation();

  useEffect(() => {
    // Check if the effect has run, or if not in development mode (React 18 Strict Mode)
    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      const verifyRefreshToken = async () => {
        try {
          // const response =
          await refresh();
          // const {accessToken} = response.data
          setTrueSuccess(true);
        } catch (err) {
          console.error(err);
        }
      };

      // Verify refresh token only if there is no current token and persistence is enabled
      if (!token && persist) {
        verifyRefreshToken();
      }
    }

    // Set effectRan to true on cleanup to prevent multiple executions
    return () => (effectRan.current = true);

    // eslint-disable-next-line
  }, []);

  let content;

  if (!persist) {
    // persist: no
    console.log("no persist");
    content = <Outlet />;
  } else if (isLoading) {
    // persist: yes, token: no
    console.log("loading");
    content = <p>Loading...</p>;
  } else if (isError) {
    // persist: yes, token: no
    console.log("error");
    content = (
      <p className="errmsg">
        {`${error?.data?.message} - `}
        <Link to="/login">Please login again</Link>.
      </p>
    );
  } else if (isSuccess && trueSuccess) {
    // persist: yes, token: yes
    console.log("success");
    content = <Outlet />;
  } else if (token && isUninitialized) {
    // persist: yes, token: yes
    content = <Outlet />;
  }

  return content;
};

export default PersistLogin;
