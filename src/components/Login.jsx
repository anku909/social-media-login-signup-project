import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFirebase } from "../context/firebase";

function Login() {
  const firebase = useFirebase();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async () => {
    try {
      await firebase.signinUserWithEmailAndPassword(email, password);
      // Handle successful sign-in
    } catch (error) {
      // Handle sign-in error
      setError(true);
    }
    setError(true);
    setTimeout(() => {
      setError(false);
    }, 2000);
  };

  const handleShowPass = (e) => {
    e.stopPropagation();
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="login w-full h-screen flex items-center justify-center  bg-slate-200 sm:px-[10vw]  md:px-[10vw] lg:px-[10vw] xl:px-[20vw] 2xl:px-[25vw]">
        <div className="login-inner-section w-full h-screen flex items-center justify-center sm:justify-end md:justify-end lg:justify-end xl:justify-end bg-blue-100  lg:pt-20 lg:flex  ">
          <div className="logo-or-details-section lg:w-[25vw] lg:h-5/6"></div>
          <div className="login-function-section w-[350px] sm:w-[400px] md:w-[400px] lg:w-[420px]   ">
            <div className="login-box w-full  border-[1px] border-[#a8a8a8]">
              <div className="heading w-full py-4 lg:py-8">
                <h1 className="heading-text  text-2xl sm:text-4xl  text-center font-semibold font-mono">
                  Social Media
                </h1>
              </div>
              <div
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSignIn();
                  }
                }}
                className="login-details-section w-full h-[40vh]  px-4 flex flex-col gap-3 sm:px-8 md:px-10 lg:px-12 sm:h-[40vh] md:h-[40vh] lg:h-[40vh] xl:h-[40vh] 2xl:h-[32vh] "
              >
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 border-[1px] border-[#b4b2b2]  bg-zinc-100   outline-none rounded-md placeholder:text-sm px-3"
                  type="email"
                  name="email"
                  id="email"
                  placeholder="email"
                />
                <div className="password-input w-full h-10 border-[1px]  border-[#b4b2b2] bg-zinc-100 rounded-md pl-3 flex items-center">
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-[90%] h-full  bg-zinc-100 outline-none border-none placeholder:text-sm"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="password"
                  />
                  <div
                    className="hide-show-icon cursor-pointer"
                    onClick={handleShowPass}
                  >
                    {showPassword ? (
                      <i className="ri-eye-2-line"></i>
                    ) : (
                      <i className="ri-eye-close-line"></i>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleSignIn}
                  className="login w-full h-10 bg-blue-500 text-xl text-white font-bold rounded-[4px]"
                  type="submit"
                >
                  Login
                </button>
                <p
                  className={`w-full h-6 text-red-500 text-center text-sm lg:text-[12px] ${
                    error ? "visible" : "hidden"
                  }`}
                >
                  email or Password is Invalid!
                </p>
                <div className="flex flex-col justify-center gap-2">
                  <div className="or-container flex items-center gap-4 ">
                    <div className="line-left w-1/2 h-[1px] bg-[#aeacac]"></div>
                    <span>Or</span>
                    <div className="line-right w-1/2 h-[1px] bg-[#aeacac]"></div>
                  </div>
                  <div className="login-with-other flex justify-center items-center">
                    <button
                      onClick={() => firebase.signUpWithGoogle()}
                      className="font-semibold text-blue-500 font-sans"
                    >
                      Log in with Gmail
                    </button>
                  </div>
                  <button className="text-sm font-sans">
                    Forgot Password?
                  </button>
                </div>
              </div>
            </div>
            <div className="other-options w-full h-16 border-[1px] border-[#a8a8a8] flex items-center justify-center mt-2">
              <p className="text-sm font-sans">
                Don't have an account?
                <Link to="/signup" className="text-blue-500 font-semibold">
                  {" "}
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
