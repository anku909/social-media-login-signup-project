import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";

function Profile() {
  const params = useParams();
  const { id } = params;
  const [fetchedUser, setFetchedUser] = useState("");

  useEffect(() => {
    if (id) {
      const fetchUserData = async () => {
        try {
          let responseData = await axios.get(
            `https://server-bice-xi.vercel.app/api/profile/${id}`
          );
          const data = responseData;
          setFetchedUser(data.data);
        } catch (error) {
          console.error("Not able to fetch user", error);
        }
      };
      fetchUserData();
    }
  }, [id]);

  return (
    <>
      <Header />
      <div className="w-full h-screen bg-slate-50 lg:px-[20vw]">
        <div className="showUserProfile w-full h-full bg-slate-200 flex  items-center justify-center px-4 lg:pt-32 lg:px-20">
          <div className="cardWrapper w-[22rem] flex flex-col items-center justify-start border-[1px] border-[#bbbbbb] hover:border-[#989898] px-2 py-4 sm:w-[24rem]  lg:px-4 lg:w-[50%]">
            <div className="profileCardImg w-full relative rounded-md">
              <div className="coverimgContainer w-full h-36 relative rounded-lg overflow-hidden lg:h-56">
                <img
                  className="w-full h-full object-cover opacity-95"
                  src={fetchedUser?.coverImg}
                />
              </div>
              <div className="profileImg w-16 h-16 rounded-full overflow-hidden absolute -bottom-10 left-1/2 -translate-x-1/2 drop-shadow-2xl sm:w-20 sm:h-20 lg:w-28 lg:h-28">
                <img
                  className="w-full h-full object-cover"
                  src={fetchedUser?.profileImg}
                />
              </div>
            </div>
            <div className="profileCarddetails w-full border-[1px] border-[#b5b2b2] rounded-md px-5 py-10 mt-4 flex flex-col items-center justify-center gap-2">
              <h1 className=" text-xl font-mono font-bold sm:text-2xl lg:text-3xl">
                {fetchedUser.name}
              </h1>
              <span className=" text-xs  font-mono sm:text-sm lg:text-base">
                @{fetchedUser?.userName ? fetchedUser?.userName : "--"}
              </span>
              <h1 className=" text-xs text-md font-mono lg:text-sm">
                {fetchedUser?.email}
              </h1>
              <div className="other-details flex gap-6 mt-2">
                <span className="text-xs font-thin sm:text-sm lg:text-base">
                  {fetchedUser.location ? fetchedUser.location : "--"}
                </span>
                <span className="text-xs font-thin sm:text-sm lg:text-base">
                  {fetchedUser.gender ? fetchedUser.gender : "--"}
                </span>
                <span className="text-xs font-thin sm:text-sm lg:text-base">
                  --
                </span>
              </div>
              <div className="bio-section w-full h-12 sm:h-16 lg:w-80 lg:h-20 ">
                <p className="text-center opacity-80 text-sm font-medium">
                  {fetchedUser?.bio}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Profile;
