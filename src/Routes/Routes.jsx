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
  const [cookies, setCookie] = useCookies(["myCookie"]);

  const { token } = firebase;

  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const fetchTokenFromLocalStorage = async () => {
      if (cookies) {
        setIsLoggedIn(true);
      } else {
        try {
          let localToken = await token;
          if (localToken) {
            setIsLoggedIn(true);
            setCookie("myCookie", localToken, { path: "/" });
          } else {
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.error("Error fetching token:", error);
          setIsLoggedIn(false);
        }
      }
    };
    fetchTokenFromLocalStorage();
  }, [cookies, setCookie, token]);

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
