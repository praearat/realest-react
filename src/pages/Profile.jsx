import { getAuth } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router";

const Profile = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = userData;

  const onSignOut = () => {
    auth.signOut();
    navigate("/");
  };

  return (
    <div>
      <section className="flex flex-col items-center">
        <h1 className="text-3xl text-center font-bold mt-6">My Profile</h1>
        <div className="w-full md:w-[50%] px-5 mt-6">
          <form>
            <input
              className="w-full px-5 py-3 rounded-md border-gray-300 text-sm text-gray-700 transition ease-in-out mb-3"
              type="text"
              id="name"
              value={name}
              disabled
            />
            <input
              className="w-full px-5 py-3 rounded-md border-gray-300 text-sm text-gray-700 transition ease-in-out mb-3"
              type="email"
              id="email"
              value={email}
              disabled
            />
            <div className="flex justify-between mb-3 whitespace-nowrap text-sm">
              <p className="flex ">
                Do you want to change your name?
                <p className="mx-1 text-red-500 hover:text-red-600 cursor-pointer transition duration-200 ease-in-out">
                  Edit
                </p>
              </p>
              <p
                className="text-blue-600 hover:text-blue-700 cursor-pointer transition duration-200 ease-in-out"
                onClick={onSignOut}
              >
                Sign out
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Profile;
