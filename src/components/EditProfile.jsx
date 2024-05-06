import React, { useEffect, useRef, useState } from "react";
import { useFirebase } from "../context/firebase";

function EditProfile({
  setEditProfile,
  fullName,
  coverImgUrl,
  profileImgUrl,
  userEmail,
}) {
  const profileInput = useRef(null);
  const coverInput = useRef(null);
  const [profileImg, setProfileImg] = useState(null);
  const [coverImg, setCoverImg] = useState(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const firebase = useFirebase();

  console.log(firebase.user.accessToken);

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
      formData.append("userName", username);
      formData.append("bio", bio);
      formData.append("gender", gender);
      formData.append("location", location);
      formData.append("coverImg", coverImg);
      formData.append("profileImg", profileImg);

      const response = await fetch(
        `https://server-self-tau.vercel.app/api/update/${userEmail}`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to Submit form");
      }
      console.log(formData);
      setFormSubmitted(true);
      setEditProfile(false);
    } catch (error) {
      console.error("error", error);
    }
  };

  useEffect(() => {
    if (formSubmitted) {
      // Reset form fields after successful submission
      setTimeout(() => {
        setCoverImg(null);
        setName("");
        setBio("");
        setLocation("");
        setGender("");
        setPhoneNo("");
        setProfileImg(null);
        setUsername("");
        setFormSubmitted(false);
      }, 1000);
    }
  }, [formSubmitted]);

  return (
    <>
      <div className="edit-profile w-full h-full flex bg-slate-300 items-center justify-center absolute">
        <div className="edit-profile-box w-[25%] bg-slate-200 border-[1px] border-[#a8a8a8] ">
          <div className="heading w-full pt-4 mb-2 ">
            <h1 className="heading-text text-xl text-center font-semibold font-mono">
              Edit Profile
            </h1>
          </div>
          <div className="edit-profile-details-section w-full h-[32vh]mt-2 px-20 flex flex-col items-center gap-4 relative ">
            <form
              onSubmit={handleSubmit}
              className="w-full h-full flex flex-col items-center justify-center gap-2"
            >
              <div
                className="coverImg w-full h-32 flex justify-center mb-8 overflow-hidden border-[#dbd9d9] border-[1px] rounded-md"
                onClick={handleCoverImageClick}
              >
                {coverImg ? (
                  <img
                    className="w-full object-cover rounded-md"
                    src={URL.createObjectURL(coverImg)}
                    alt="coverImg"
                  />
                ) : (
                  <img
                    className="w-full h-full object-cover"
                    src={coverImgUrl}
                    alt="profile"
                  />
                )}
              </div>
              <input
                type="file"
                name="coverImg"
                id="coverImg"
                ref={coverInput}
                onChange={handleCoverImageChange}
                className="hidden "
              />
              <div
                className="profile w-20 h-20 rounded-full border-zinc-500 border-2 overflow-hidden absolute top-20"
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
                    className="w-full h-full object-cover"
                    src={profileImgUrl}
                    alt="profile"
                  />
                )}
              </div>
              <input
                type="file"
                name="profileImg"
                id="profileImg"
                ref={profileInput}
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
                placeholder={fullName}
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
              <div className="w-full h-10  px-2 flex justify-start items-center gap-4">
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="male"
                  checked={gender === "male"}
                  onChange={(e) => setGender(e.target.value)}
                />
                <label htmlFor="male">Male</label>
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="female"
                  checked={gender === "female"}
                  onChange={(e) => setGender(e.target.value)}
                />
                <label htmlFor="female">Female</label>
              </div>
              <input
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-10 border-[1px] border-[#b4b2b2] bg-zinc-100 outline-none rounded-md px-4"
                type="text"
                name="location"
                id="location"
                value={location}
                placeholder="Location"
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
              <textarea
                onChange={(e) => setBio(e.target.value)}
                className="w-full max-h-16 border-[1px] border-[#b4b2b2] bg-zinc-100 outline-none rounded-md px-4 py-2"
                type="text"
                name="bio"
                id="bio"
                value={bio}
                placeholder="Bio"
                style={{ resize: "none" }}
              />
              <div className="btns-section w-full flex justify-between items-center px-2">
                <button
                  type="submit"
                  className="w-32 h-10  bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-md mt-4 mb-1"
                >
                  save
                </button>
                <button
                  onClick={() => setEditProfile(false)}
                  className="w-32 h-10 border-[1px] border-[#c7c4c4] font-semibold text-lg rounded-md mt-4 mb-1"
                >
                  cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditProfile;
