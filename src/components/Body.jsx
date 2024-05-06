import React, { useEffect, useState } from "react";
import { useFirebase } from "../context/firebase";
import axios from "axios";
import EditProfile from "./EditProfile";
import settingImg from "../assets/setting.png";
import { QRCodeSVG } from "qrcode.react";

function Body() {
  const firebase = useFirebase();
  const { user } = firebase;
  const userEmail = user?.email;
  const [fetchedUser, setFetchedUser] = useState("");
  const [editProfile, setEditProfile] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  const [password, setPassword] = useState(null);
  const [showSetPass, setShowSetPass] = useState(false);
  const [updatePassError, setUpdatePassError] = useState(null);
  const [showQrCode, setShowQrCode] = useState(false);
  const [showDelteuser, setShowDelteuser] = useState(false);
  const [deleteUser, setDelteuser] = useState(false);

  console.log(user);

  const fullName = fetchedUser.name
    ? fetchedUser.name
    : user?.providerData[0]?.displayName;

  const profileImgUrl = fetchedUser.profileImg
    ? fetchedUser.profileImg
    : user?.providerData[0]?.photoURL;

  const coverImgUrl = fetchedUser?.coverImg;
  console.log(fetchedUser);
  useEffect(() => {
    if (userEmail) {
      const fetchUserData = async () => {
        try {
          let responseData = await axios.get(
            `https://server-self-tau.vercel.app/api/user/${userEmail}`
          );
          const data = responseData;
          setFetchedUser(data.data);
        } catch (error) {
          console.error("Not able to fetch user", error);
        }
      };
      fetchUserData();
    }
  }, [userEmail]);

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
    firebase
      .resetPasswordWithoutOtp(password)
      .then((data) => {
        // Handle response here
        setUpdatePassError(data);
        if (data && data.success) {
          setShowSetPass(!showSetPass);
          // Any further logic that depends on the response should be placed here
        }
      })
      .catch((err) => {
        setUpdatePassError(err.message);
        console.error("Error in password update", err);
      });
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
        setDelteuser(true);
        console.log("user deleted");
      } else {
        setDelteuser(false);
        console.log("canceled");
      }
      handleShowDeleteUerOption();
    } catch (error) {
      console.log("Error in User deletion", error.message);
    }
  };

  const profileQrCodeUrl = `https://server-self-tau.vercel.app/profile/${fetchedUser._id}`;

  return (
    <>
      {editProfile ? (
        <EditProfile
          setEditProfile={setEditProfile}
          fullName={fullName}
          profileImgUrl={profileImgUrl}
          coverImgUrl={coverImgUrl}
          userEmail={userEmail}
        />
      ) : (
        <div className="w-full h-screen bg-slate-50 px-[20vw]">
          <div className="showUserProfile w-full h-full bg-slate-200  pt-32 px-20 flex  items-start justify-center">
            <div className="cardWrapper w-[50%]  flex flex-col items-center justify-start border-[1px] border-[#bbbbbb] hover:border-[#989898]  px-4 py-4 ">
              {showQrCode ? (
                <>
                  <QRCodeSVG
                    className="w-[80%] h-[80%] "
                    value={profileQrCodeUrl}
                  />
                  <h1 className="text-2xl font-semibold font-mono ">
                    {" "}
                    Scan to see User profile
                  </h1>
                  <div
                    onClick={handleShowQrCode}
                    className="rounded-back-button w-12 h-12 border-[#bfbdbd] border-[1px] flex items-center justify-center rounded-full mt-2"
                  >
                    <i className="ri-arrow-left-line text-2xl cursor-pointer"></i>
                  </div>
                </>
              ) : (
                <>
                  <div className="profileCardImg w-full relative rounded-md">
                    <div className="coverimgContainer w-full h-56 relative rounded-lg overflow-hidden">
                      <img
                        className="w-full h-full object-cover opacity-95"
                        src={coverImgUrl}
                      />
                    </div>
                    <div
                      onClick={handleShowSetting}
                      className="settting-icon w-16 h-16 absolute -top-9 -right-8 rounded-full overflow-hidden flex items-center justify-center cursor-pointer z-50"
                    >
                      <img src={settingImg} alt="" />
                    </div>
                    <div className="profileImg w-28 h-28 rounded-full overflow-hidden absolute -bottom-10 left-1/2 -translate-x-1/2 drop-shadow-2xl">
                      <img
                        className="w-full h-full object-cover"
                        src={profileImgUrl}
                      />
                    </div>
                    {showSetting ? (
                      <div className="setting w-full h-80 rounded-lg bg-zinc-200 border-[1px] border-[#969595] absolute top-0 z-2 py-4 px-5">
                        <h2 className="text-center h-10 text-2xl  text-bold bg-slate-100 rounded-lg ">
                          Setting Panel
                        </h2>
                        <div className="setting-options-section w-full  mt-4 pt-4 flex flex-col gap-4">
                          <div className="update-password w-full h-12">
                            {showSetPass ? (
                              <div className="password-input w-full h-10 border-[1px]  border-[#b4b2b2] bg-zinc-100 rounded-md pl-3 flex items-center">
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
                              <p className="text-center text-md font-semibold">
                                Reset your password
                              </p>
                            )}
                          </div>
                          {showSetPass ? (
                            <button
                              onClick={() => handleUpdatePass(password)}
                              className="w-full h-10 bg-blue-500 rounded-[4px] text-white text-md font-semibold"
                            >
                              Update Password
                            </button>
                          ) : (
                            <div>
                              <button
                                onClick={handleShowSetPass}
                                className="w-full h-10 bg-blue-500 rounded-[4px] text-white text-md font-semibold"
                              >
                                Reset Password
                              </button>
                              {updatePassError ? (
                                <span>{updatePassError}</span>
                              ) : (
                                ""
                              )}
                            </div>
                          )}
                          <button
                            onClick={handleShowDeleteUerOption}
                            className="w-full h-10   rounded-[4px] text-white text-md font-semibold bg-slate-400 hover:bg-red-500 transition-colors ease-in"
                          >
                            Delete User
                          </button>
                          {showDelteuser ? (
                            <div className="confirm-btns-section px-2 flex justify-between mb-2">
                              <button
                                onClick={() => handleDeleteUer(true)}
                                className="w-32 h-10 bg-red-500 rounded-full text-white text-md font-semibold"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => handleDeleteUer(false)}
                                className="w-32 h-10 border-[#b6b3b3] border-[1px] rounded-full text-white text-md font-semibold"
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
                  <div className="profileCarddetails w-full border-[1px] border-[#b5b2b2] rounded-md px-5 py-10 mt-4 flex flex-col items-center justify-center gap-2">
                    <h1 className=" text-2xl font-mono font-bold">
                      {fullName}
                    </h1>
                    <span className=" text-md font-mono">
                      @{fetchedUser?.userName ? fetchedUser?.userName : "--"}
                    </span>
                    <h1 className="  text-md font-mono ">
                      {fetchedUser?.email}
                    </h1>
                    <div className="other-details flex gap-6">
                      <span className="text-md font-thin">
                        {fetchedUser.location ? fetchedUser.location : "--"}
                      </span>
                      <span>
                        {fetchedUser.gender ? fetchedUser.gender : "--"}
                      </span>
                      <span>--</span>
                    </div>
                    <div className="bio-section w-80 h-20 ">
                      <p className="text-center opacity-80 text-sm font-medium">
                        {fetchedUser?.bio}
                      </p>
                    </div>
                    <i
                      onClick={handleShowQrCode}
                      className="ri-qr-scan-2-line text-5xl cursor-pointer"
                    ></i>
                  </div>

                  <div className="function-btns w-full flex items-center justify-between px-4 mt-5">
                    <button
                      onClick={handleEditProfile}
                      className="w-32 h-8 py-1 rounded-full border-[#a4a3a3] border-[1px]"
                    >
                      Edit profile
                    </button>
                    <button
                      onClick={() => firebase.handleSignOut()}
                      className="w-32 h-8 py-1 bg-blue-500 rounded-full hover:bg-red-600 text-white font-semibold"
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
