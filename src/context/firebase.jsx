import { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";

import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  signInWithEmailAndPassword,
  updatePassword,
  deleteUser,
} from "firebase/auth";
import { useCookies } from "react-cookie";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const FirebaseContext = createContext(null);

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = (props) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [cookie, removeCookie] = useCookies(["myCookie"]);
  const [error, setError] = useState("");

  setTimeout(() => {
    setError("");
  }, 3000);

  useEffect(() => {
    const auth = getAuth();
    const subscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        user.getIdToken().then((token) => setToken(token));
      } else {
        setUser(null);
        setToken(null);
      }
    });
    return subscribe;
  }, [user, token]);

  const handleSignOut = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      setUser(null);
      setToken(null);
      removeCookie("myCookie"); // Remove the cookie with the correct path
    } catch (error) {
      setError(error.message);
    }
  };

  const signupUserWithEmailAndPassword = async (email, password) => {
    try {
      setError("");
      await createUserWithEmailAndPassword(firebaseAuth, email, password);
    } catch (error) {
      setError(error.message);
    }
  };

  const signinUserWithEmailAndPassword = async (email, password) => {
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    } catch (error) {
      setError(error.message);
    }
  };

  const signUpWithGoogle = async () => {
    try {
      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(firebaseAuth, googleProvider);
      const { user } = result;
      const { email, displayName, photoURL } = user;

      const exisitingUser = async () => {
        try {
          const response = await fetch(
            `https://server-bice-xi.vercel.app/api/user/${email}`
          );
          if (response.ok) {
            const data = await response.json();
            return data.exists; // Assuming the response contains a property indicating if the user exists
          } else {
            throw new Error("Failed to fetch user data");
          }
        } catch (error) {
          setError(error.message);
        }
      };

      // Await the result of exisitingUser function
      const userExists = await exisitingUser();
      if (!userExists) {
        const createUserLocally = async (email, displayName, photoURL) => {
          const body = JSON.stringify({
            name: displayName,
            email: email,
            profileImg: photoURL,
          });
          const response = await fetch(
            "https://server-bice-xi.vercel.app/api/signup",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: body,
            }
          );

          if (!response.ok) {
            throw new Error("Error in creating user locally");
          }
        };

        await createUserLocally(email, displayName, photoURL);
      }
    } catch (error) {
      if (error.code === "auth/cancelled-popup-request") {
        console.log("Authentication popup was canceled by the user.");
      } else {
        console.error("Authentication error:", error);
      }
    }
  };

  const resetPasswordWithoutOtp = async (newPassword) => {
    try {
      const user = firebaseAuth.currentUser;
      if (newPassword != null && newPassword.length >= 6) {
        const response = await updatePassword(user, newPassword);
        console.log(response);
        return { response: "success" };
      } else {
        throw new Error("Password must be at least 6 characters long");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const firebaseDeleteUser = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    try {
      await deleteUser(user);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        user,
        token,
        error,
        signupUserWithEmailAndPassword,
        signinUserWithEmailAndPassword,
        signUpWithGoogle,
        handleSignOut,
        resetPasswordWithoutOtp,
        firebaseDeleteUser,
      }}
    >
      {props.children}
    </FirebaseContext.Provider>
  );
};
