import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
import Home from "../components/Home";
import { useFirebase } from "../context/firebase";
import Profile from "../components/Profile";
import { useCookies } from "react-cookie";

function AppRoutes() {
  const firebase = useFirebase();
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const { user, token } = firebase;
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);

  useEffect(() => {
    if (cookies && cookies.myCookie) {
      setIsLoggedIn(true);
    }
  }, [cookies]);

  useEffect(() => {
    const fetchTokenFromLocalStorage = async () => {
      try {
        if (!cookies.myCookie && isLoggedIn !== false) {
          setIsLoggedIn(false);
        } else if (token != null && token !== "" && !cookies.myCookie) {
          setCookie("myCookie", token, { path: "/" });
          setIsLoggedIn(true);
        } else if (
          (token === "" && cookies.myCookie == null) ||
          cookies.myCookie == undefined ||
          cookies.myCookie == ""
        ) {
          removeCookie("myCookie");
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error setting cookie:", error);
        setIsLoggedIn(false);
      }
    };

    fetchTokenFromLocalStorage();

    // Clear the cookie when the user logs out
  }, [cookies, token, setCookie, removeCookie, setIsLoggedIn, isLoggedIn]); // Include removeCookie in the dependency array if it's not a stable function

  return (
    <div>
      <Routes>
        <Route
          exact
          path="/login"
          element={isLoggedIn ? <Navigate to="/" /> : <Login />}
        />
        <Route
          exact
          path="/signup"
          element={isLoggedIn ? <Navigate to="/" /> : <SignUp />}
        />
        <Route
          path="/"
          element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
        />
        <Route path="/profile/:id" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default AppRoutes;
