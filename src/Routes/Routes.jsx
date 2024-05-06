import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
import Home from "../components/Home";
import { useFirebase } from "../context/firebase";
import Profile from "../components/Profile";

function AppRoutes() {
  const firebase = useFirebase();

  const { token } = firebase;

  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    // state to handle successful login
    const fetchTokenFromLocalStorage = async () => {
      let storedToken = localStorage.getItem("firebaseToken");
      console.log(storedToken);
      if (storedToken) {
        setIsLoggedIn(true);
      } else {
        try {
          // Token not found in local storage, fetch it from the server
          storedToken = await token; // Replace this with the actual function to fetch the token from the server
          if (storedToken) {
            // Token fetched successfully, set it in local storage
            localStorage.setItem("firebaseToken", storedToken);
            setIsLoggedIn(true);
          } else {
            // Token not available from server
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.error("Error fetching token:", error);
          setIsLoggedIn(false);
        }
      }
    };
    fetchTokenFromLocalStorage();
  }, [token]);

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
