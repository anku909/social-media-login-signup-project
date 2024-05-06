import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";

function Profile() {
  const params = useParams();
  const { id } = params;
  const [fetchedUser, setFetchedUser] = useState("");

  console.log(`https://server-self-tau.vercel.app/api/profile/${id}`);

  console.log(fetchedUser);

  useEffect(() => {
    if (id) {
      const fetchUserData = async () => {
        try {
          let responseData = await axios.get(
            `https://server-self-tau.vercel.app/api/profile/${id}`
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
      <div className="w-full h-screen bg-slate-50 px-[20vw]">
        <div className="showUserProfile w-full h-full bg-slate-200  pt-32 px-20 flex  items-start justify-center">
          <div className="cardWrapper w-[50%] flex flex-col items-center justify-start border-[1px] border-[#bbbbbb] hover:border-[#989898]  px-4 py-4">
            <div className="profileCardImg w-full relative rounded-md">
              <div className="coverimgContainer w-full h-56 relative rounded-lg overflow-hidden">
                <img
                  className="w-full h-full object-cover opacity-95"
                  src={fetchedUser?.coverImg}
                />
              </div>
              <div className="profileImg w-28 h-28 rounded-full overflow-hidden absolute -bottom-10 left-1/2 -translate-x-1/2 drop-shadow-2xl">
                <img
                  className="w-full h-full object-cover"
                  src={fetchedUser?.profileImg}
                />
              </div>
            </div>
            <div className="profileCarddetails w-full border-[1px] border-[#b5b2b2] rounded-md px-5 py-10 mt-4 flex flex-col items-center justify-center gap-2">
              <h1 className=" text-2xl font-mono font-bold">
                {fetchedUser.name}
              </h1>
              <span className=" text-md font-mono">
                @{fetchedUser?.userName ? fetchedUser?.userName : "--"}
              </span>
              <h1 className="  text-md font-mono ">{fetchedUser?.email}</h1>
              <div className="other-details flex gap-6">
                <span className="text-md font-thin">
                  {fetchedUser.location ? fetchedUser.location : "--"}
                </span>
                <span>{fetchedUser.gender ? fetchedUser.gender : "--"}</span>
                <span>--</span>
              </div>
              <div className="bio-section w-80 h-20 ">
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
