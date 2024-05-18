import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import defaultProfileImg from "../assets/default-profile.png";
import { useFirebase } from "../context/firebase";
import axios from "axios";

function SignUp() {
  const profileInput = useRef(null);
  const coverInput = useRef(null);
  const [profileImg, setProfileImg] = useState(null);
  const [coverImg, setCoverImg] = useState(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const firebase = useFirebase();

  const handleProfileImageClick = () => {
    profileInput.current.click();
  };

  const handleCoverImageClick = () => {
    coverInput.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setProfileImg(file);
  };
  console.log(profileImg);

  const handleCoverImageChange = (event) => {
    const file = event.target.files[0];
    setCoverImg(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phoneNo", phoneNo);
      formData.append("email", email);
      formData.append("userName", username);
      formData.append("password", password);
      formData.append("coverImg", coverImg);
      formData.append("profileImg", profileImg);

      const response = await axios.post(
        "https://server-bice-xi.vercel.app/api/signup",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!response.status === 200) {
        throw new Error("Failed to Submit form");
      }

      console.log(response.data);
      setFormSubmitted(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (formSubmitted) {
      // Reset form fields after successful submission
      setTimeout(() => {
        setCoverImg(null);
        setEmail("");
        setName("");
        setPassword("");
        setPhoneNo("");
        setProfileImg(null);
        setUsername("");
        setFormSubmitted(false); // Reset formSubmitted state
      }, 1000);
    }
  }, [formSubmitted]);

  const handleShowPass = (e) => {
    e.stopPropagation();
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="signUp w-full min-h-screen px-4 xl:px-[25vw] bg-slate-200 ">
        <div className="singUp-inner-section w-full min-h-screen flex items-center justify-center">
          <div className="SignUp-function-section h-full flex flex-col xl:w-[30vw] xl:h-5/6 xl:px-12 ">
            <div className="signUp-box w-full h-full border-[1px] border-[#a8a8a8]">
              <div className="heading w-full pt-2 mb-4 xl:pt-4 xl:mb-8">
                <h1 className="heading-text  text-center font-semibold font-mono text-2xl sm:text-3xl xl:text-4xl">
                  Social Media
                </h1>
              </div>
              <div className="signUp-details-section w-full px-4 flex flex-col items-center gap-4 relative  xl:px-8">
                <form
                  onSubmit={handleSubmit}
                  className="w-full h-full flex flex-col items-center justify-center gap-2"
                >
                  <div
                    className="coverImg w-full h-32 flex justify-center mb-8 overflow-hidden border-[#dbd9d9] border-[1px] rounded-md cursor-pointer"
                    onClick={handleCoverImageClick}
                  >
                    {coverImg ? (
                      <img
                        className="w-full object-cover rounded-md"
                        src={URL.createObjectURL(coverImg)}
                        alt="coverImg"
                      />
                    ) : (
                      <div className=" w-full h-full bg-gradient-to-t from-slate-400 to-slate-300 rounded-md"></div>
                    )}
                  </div>
                  <input
                    type="file"
                    name="coverImg"
                    id="coverImg"
                    ref={coverInput}
                    accept="image/*"
                    onChange={handleCoverImageChange}
                    className="hidden "
                  />
                  <div
                    className="profile w-20 h-20 rounded-full border-zinc-500 border-2 overflow-hidden absolute top-20 cursor-pointer"
                    onClick={handleProfileImageClick}
                  >
                    {profileImg ? (
                      <img
                        className="w-full  object-cover"
                        src={URL.createObjectURL(profileImg)}
                        alt="profile"
                      />
                    ) : (
                      <img
                        className="w-full h-full object-cover bg-slate-400"
                        src={defaultProfileImg}
                        alt="profile"
                      />
                    )}
                  </div>
                  <input
                    type="file"
                    name="profileImg"
                    id="profileImg"
                    ref={profileInput}
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    autoComplete="off"
                  />

                  <input
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-10 border-[1px] border-[#b4b2b2]  bg-zinc-100 outline-none rounded-md px-4"
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    placeholder="Name "
                    autoComplete="off"
                  />
                  <input
                    onChange={(e) => setPhoneNo(e.target.value)}
                    className="w-full h-10 border-[1px] border-[#b4b2b2] bg-zinc-100 outline-none rounded-md px-4"
                    type="text"
                    name="number"
                    id="number"
                    value={phoneNo}
                    placeholder="Phone no"
                    autoComplete="off"
                  />
                  <input
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full h-10 border-[1px] border-[#b4b2b2] bg-zinc-100 outline-none rounded-md px-4"
                    type="text"
                    name="username"
                    id="username"
                    value={username}
                    placeholder="Username"
                  />
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 border-[1px] border-[#b4b2b2] bg-zinc-100 outline-none rounded-md px-4"
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={email}
                    placeholder="Email"
                  />
                  <div className="password-input w-full h-10 border-[1px]  border-[#b4b2b2] bg-zinc-100 rounded-md pl-3 flex items-center">
                    <input
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-[90%] h-full  bg-zinc-100 outline-none border-none placeholder:text-sm"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      placeholder="Password"
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
                    onClick={() =>
                      firebase.signupUserWithEmailAndPassword(email, password)
                    }
                    type="submit"
                    className="w-full h-10  bg-blue-500 hover:bg-blue-700 text-white font-bold rounded mt-4 mb-1"
                  >
                    Sign Up
                  </button>
                </form>

                <span className="text-xs mt-[-18px]">
                  By signing up, you agree to our Terms , Privacy Policy and
                  Cookies Policy .
                </span>

                <div className="or-container w-full flex items-center gap-4 ">
                  <div className="line-left w-1/2 h-[1px] bg-[#aeacac]"></div>
                  <span>Or</span>
                  <div className="line-right w-1/2 h-[1px] bg-[#aeacac]"></div>
                </div>
                <div className="signUp-with-other flex justify-center items-center">
                  <button
                    onClick={() => firebase.signUpWithGoogle()}
                    className="font-semibold text-blue-500 font-sans mb-4"
                  >
                    Sign up with Gmail
                  </button>
                </div>
              </div>
            </div>
            <div className="other-options w-full h-16 border-[1px] border-[#a8a8a8] flex items-center justify-center mt-2">
              <p className="text-sm font-sans">
                Have an account?
                <Link to="/" className="text-blue-500 font-semibold">
                  {" "}
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUp;
