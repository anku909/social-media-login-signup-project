import React, { useEffect, useState } from "react";
import { useFirebase } from "../context/firebase";
import axios from "axios";
import EditProfile from "./EditProfile";
import settingImg from "../assets/setting.png";
import { QRCodeSVG } from "qrcode.react";
import { useCookies } from "react-cookie";
import { profileQRCodeUrl, userApiUrl, userDelApiUrl } from "../Constants";

function Body() {
  const firebase = useFirebase();
  const { user, firebaseDeleteUser } = firebase;

  const [cookies, removeCookie] = useCookies(["myCookie"]);
  const userEmail = user?.email;
  const [fetchedUser, setFetchedUser] = useState("");
  const [editProfile, setEditProfile] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  const [password, setPassword] = useState(null);
  const [showSetPass, setShowSetPass] = useState(false);
  const [updatePassError, setUpdatePassError] = useState(null);
  const [showQrCode, setShowQrCode] = useState(false);
  const [showDelteuser, setShowDelteuser] = useState(false);
  const [updateMessage, setUpdateMessage] = useState(false);


  const fullName = fetchedUser.name
    ? fetchedUser.name
    : user?.providerData[0]?.displayName;

  const profileImgUrl =
    fetchedUser && fetchedUser.profileImgData
      ? fetchedUser?.profileImgData[0]?.profileImg
      : user?.providerData[0]?.photoURL;

  const coverImgUrl = fetchedUser && fetchedUser?.coverImgData[0]?.coverImg;

  const [profileImgLoaded, setProfileImgLoaded] = useState(false);
  const [coverImgLoaded, setCoverImgLoaded] = useState(false);

  console.log(profileImgLoaded);

  useEffect(() => {
    // Reset the loading state when the URLs change
    setProfileImgLoaded(true);
    setCoverImgLoaded(false);
  }, [profileImgUrl, coverImgUrl]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user) {
          let responseData = await axios.get(
            `${userApiUrl}${user.email}`
          );
          const data = responseData.data; // Access data property
          setFetchedUser(data);
        }
      } catch (error) {
        console.error("Not able to fetch user", error);
      }
    };

    fetchUserData();
  }, [user]);

  const handleProfileUpdated = async () => {
    try {
      const responseData = await axios.get(
        `${userApiUrl}${user.email}`
      );

      const updatedData = responseData.data; // Access data property

      setFetchedUser(updatedData);
    } catch (error) {
      console.error("Not able to fetch user", error);
    }
  };

  const handleEditProfile = () => { 
    setEditProfile(true);
  };

  const handleShowSetting = () => {
    setShowSetting(!showSetting);
  };
  const handleShowSetPass = () => {
    setShowSetPass(!showSetPass);
  };

  const handleUpdatePass = (password) => {
    try {
      if (password != null && password.length >= 6) {
        firebase.resetPasswordWithoutOtp(password);
        setTimeout(() => {
          setShowSetPass(false);
          setUpdateMessage("Password updated");
        }, 2000);
      } else {
        let error = "Invalid password length";
        setUpdatePassError(error);
        setTimeout(() => {
          setUpdatePassError("");
        }, 2500);
      }
    } catch (error) {
      console.error("error in updating Password", error.message);
    }
  };

  const handleShowQrCode = () => {
    setShowQrCode(!showQrCode);
  };

  const handleShowDeleteUerOption = () => {
    setShowDelteuser(!showDelteuser);
  };

  const handleDeleteUer = async (option) => {
    try {
      if (option) {
        let response = await axios.delete(
          `${userDelApiUrl}${userEmail}`
        );
        if (response) {
          await firebaseDeleteUser();
          setUpdateMessage("User deleted success");
          handleShowDeleteUerOption();
          setTimeout(() => {
            removeCookie("myCookie");
          }, 2500);
        }
      } else {
        handleShowDeleteUerOption();
      }
    } catch (error) {
      console.log("Error in User deletion", error.message);
    }
  };

  return (
    <>
      {editProfile ? (
        <EditProfile
          setEditProfile={setEditProfile}
          fullName={fullName}
          profileImgUrl={profileImgUrl}
          coverImgUrl={coverImgUrl}
          userEmail={userEmail}
          onProfileUpdate={handleProfileUpdated}
        />
      ) : (
        <div className="w-full min-h-screen bg-slate-50 px-6 sm:px-24 lg:px-[20vw]">
          <div className="showUserProfile w-full min-h-screen pb-20 bg-slate-200 pt-20 px-2 flex items-center justify-center lg:pt-32 lg:px-20">
            <div className="cardWrapper w-[280px] h-[62vh] py-4 px-2 flex flex-col items-center justify-start border-[1px] border-[#bbbbbb] hover:border-[#989898]  sm:w-[400px] sm:h-[74vh] sm:px-4 lg:px-4 lg:w-[550px] lg:h-[80vh]">
              {showQrCode ? (
                <>
                  <QRCodeSVG
                    className="w-[80%] h-[80%] "
                    value={`${profileQRCodeUrl}${fetchedUser?._id}`}
                  />
                  <h1 className="text-base font-semibold font-mono sm:text-2xl lg:text-2xl">
                    {" "}
                    Scan to see User profile
                  </h1>
                  <div
                    onClick={handleShowQrCode}
                    className="rounded-back-button w-8 h-8 border-[#bfbdbd] border-[1px] flex items-center justify-center rounded-full mt-4 sm:w-10 sm:h-10 lg:w-12 lg:h-12 "
                  >
                    <i className="ri-arrow-left-line text-xl cursor-pointer sm:text-2xl lg:text-3xl"></i>
                  </div>
                </>
              ) : (
                <>
                  <div className="profileCardImg w-full relative rounded-md">
                    <div className="coverimgContainer w-full h-full relative rounded-lg overflow-hidden sm:h-40 lg:h-56 bg-gradient-to-t from-slate-500 to-slate-300">
                      {coverImgUrl && (
                        <img
                          className={`w-full h-full object-cover ${
                            coverImgLoaded ? "" : "hidden"
                          }`}
                          src={coverImgUrl}
                          onLoad={() => setCoverImgLoaded(true)}
                          onError={() => setCoverImgLoaded(false)}
                        />
                      )}
                    </div>

                    <div className="profileImg w-16 h-16 lg:w-28 lg:h-28 rounded-full absolute -bottom-10 left-1/2 transform -translate-x-1/2 drop-shadow-2xl border-[#e9e7e7] border-[2px] bg-gradient-to-t from-slate-500 to-slate-300 overflow-hidden">
                      {profileImgUrl && (
                        <img
                          className={`w-full h-full object-cover opacity-95 ${
                            profileImgLoaded ? "" : "hidden"
                          }`}
                          src={profileImgUrl}
                          onLoad={() => setProfileImgLoaded(true)}
                          onError={() => setProfileImgLoaded(false)}
                        />
                      )}
                    </div>
                    <div
                      onClick={handleShowSetting}
                      className="settting-icon w-10 h-10 -top-6 -right-5 rounded-full overflow-hidden flex items-center justify-center cursor-pointer z-50 absolute sm:w-14 sm:h-14 sm:-top-7 sm:-right-7 lg:w-16 lg:h-16 lg:-top-9 lg:-right-8 "
                    >
                      <img src={settingImg} />
                    </div>

                    {showSetting ? (
                      <div className="setting w-full h-[38vh] rounded-lg bg-zinc-200 border-[1px] border-[#969595] flex flex-col items-center justify-center absolute top-0 z-2 py-4 px-5 sm:h-80 md:h-80 lg:h-[40vh]">
                        <h2 className="text-center w-full text-md  font-semibold bg-slate-100 rounded-lg mt-4 sm:text-2xl lg:h-12">
                          Setting Panel
                        </h2>
                        <div className="setting-options-section w-full h-full mt-4 pt-4 flex flex-col gap-4">
                          <div className="update-password w-full h-8 sm:mb-2 lg:mb-4">
                            {showSetPass ? (
                              <div className="password-input w-full h-8 border-[1px]  border-[#b4b2b2] bg-zinc-100 rounded-md pl-3 flex items-center sm:h-10 lg:h-12">
                                <input
                                  onChange={(e) => setPassword(e.target.value)}
                                  className="w-[90%] h-full  bg-zinc-100 outline-none border-none placeholder:text-sm"
                                  name="password"
                                  id="password"
                                  type="text"
                                  placeholder="password"
                                />
                              </div>
                            ) : (
                              <div>
                                {updateMessage ? (
                                  <p className="w-full h-10 bg-[#f2f2f2] rounded-lg text-green-400 font-bold flex items-center justify-center">
                                    {updateMessage}
                                  </p>
                                ) : (
                                  <p className="text-center text-md font-semibold lg:text-xl">
                                    Reset your password
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                          {showSetPass ? (
                            <div>
                              <button
                                onClick={() => handleUpdatePass(password)}
                                className="w-full h-6 bg-blue-500 rounded-[4px] text-white text-sm font-semibold sm:h-8 lg:h-12 lg:text-base"
                              >
                                Update Password
                              </button>
                              {updatePassError ? (
                                <p className="text-xs text-center text-red-500 mt-2">
                                  {updatePassError}
                                </p>
                              ) : (
                                ""
                              )}
                            </div>
                          ) : (
                            <div>
                              <button
                                onClick={handleShowSetPass}
                                className="w-full h-6 bg-blue-500 rounded-[4px] text-white text-sm font-semibold sm:h-8 sm:text-md lg:h-12 lg:text-base"
                              >
                                Reset Password
                              </button>
                            </div>
                          )}
                          <button
                            onClick={handleShowDeleteUerOption}
                            className="w-full h-6 rounded-[4px] text-white text-sm font-semibold bg-slate-400 hover:bg-red-500 transition-colors ease-in sm:h-8 sm:text-md lg:h-12 lg:text-base"
                          >
                            Delete User
                          </button>
                          {showDelteuser ? (
                            <div className="confirm-btns-section px-2 flex justify-between mb-2">
                              <button
                                onClick={() => handleDeleteUer(true)}
                                className="w-30 h-6 px-2 bg-red-500 rounded-full text-white text-xs font-semibold sm:w-32 sm:h-8 sm:text-sm lg:w-32 lg:h-10 lg:text-base"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => handleDeleteUer(false)}
                                className="w-30 h-6 px-2 border-[#b6b3b3] border-[1px] rounded-full text-black text-xs font-semibold sm:w-32 sm:h-8 sm:text-sm lg:w-32 lg:h-10 lg:text-base"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    ) : (
                      " "
                    )}
                  </div>
                  <div className="profileCarddetails w-full border-[1px] pt-8 mt-3 border-[#b5b2b2] rounded-md flex flex-col items-center justify-center gap-2 sm:h-full lg:px-5 lg:py-10 lg:mt-4">
                    <h1 className="text-xs sm:text-xl lg:text-2xl font-mono font-bold">
                      {fullName}
                    </h1>
                    <span className="text-xs sm:text-base lg:text-lg font-mono">
                      @{fetchedUser?.userName ? fetchedUser?.userName : "--"}
                    </span>
                    <h1 className="text-xs sm:text-base lg:text-lg  font-mono ">
                      {fetchedUser?.email}
                    </h1>
                    <div className="other-details flex gap-8 lg:gap-6">
                      <span className="text-xs sm:text-sm lg:text-base  font-thin">
                        {fetchedUser.location ? fetchedUser.location : "--"}
                      </span>
                      <span className="text-xs sm:text-sm lg:text-base font-thin">
                        {fetchedUser.gender ? fetchedUser.gender : "--"}
                      </span>
                      <span className="text-xs sm:text-sm lg:text-base font-thin">
                        --
                      </span>
                    </div>
                    <div className="bio-section w-52 h-16  lg:w-80 lg:h-24">
                      <p className="text-center opacity-80 text-sm font-medium">
                        {fetchedUser?.bio}
                      </p>
                    </div>
                    <i
                      onClick={handleShowQrCode}
                      className="ri-qr-scan-2-line text-2xl mb-1 cursor-pointer sm:text-3xl lg:text-5xl"
                    ></i>
                  </div>

                  <div className="function-btns w-full px-2 py-2 flex items-center justify-between lg:px-4 lg:mt-5">
                    <button
                      onClick={handleEditProfile}
                      className="w-20 h-6 rounded-full font-semibold border-[#a4a3a3] border-[1px] text-xs sm:w-28 sm:h-8 lg:w-32 lg:h-8 lg:py-1"
                    >
                      Edit profile
                    </button>
                    <button
                      onClick={() => firebase.handleSignOut()}
                      className="w-20 h-6 bg-blue-500 rounded-full hover:bg-red-600 text-xs text-white font-semibold sm:w-28 sm:h-8 lg:w-32 lg:h-8 lg:py-1"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Body;
