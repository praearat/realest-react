import { getAuth, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";

const Profile = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = userData;
  const [selectEdit, setSelectEdit] = useState(false);

  const onSignOut = () => {
    auth.signOut();
    navigate("/");
  };

  const onClickApplyChange = async () => {
    try {
      if (name !== auth.currentUser.displayName) {
        updateProfile(auth.currentUser, { displayName: name });
        console.log(auth.currentUser);
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, { name: name });
        toast.success("Profile was updated");
      }
    } catch (error) {
      console.log(error);
      toast.error("Could not update the profile");
    }
  };

  const onChangeName = (event) => {
    setUserData((prev) => {
      return { ...prev, [event.target.id]: event.target.value };
    });
  };

  return (
    <div>
      <section className="flex flex-col items-center">
        <h1 className="text-3xl text-center font-bold mt-6">My Profile</h1>
        <div className="w-full md:w-[50%] px-5 mt-6">
          <form>
            <input
              className={`w-full px-5 py-3 rounded-md  text-sm text-gray-700 transition ease-in-out mb-3 ${
                selectEdit
                  ? "bg-red-200 border-gray-300"
                  : "bg-white border-white"
              }`}
              type="text"
              id="name"
              value={name}
              disabled={!selectEdit}
              onChange={onChangeName}
            />
            <input
              className="w-full px-5 py-3 rounded-md border-white text-sm text-gray-700 transition ease-in-out mb-3"
              type="email"
              id="email"
              value={email}
              disabled
            />
            <div className="flex justify-between mb-3 whitespace-nowrap text-sm">
              <p className="flex ">
                Do you want to change your name?
                <p
                  className="ml-1 mr-2 text-red-500 hover:text-red-600 cursor-pointer transition duration-200 ease-in-out"
                  onClick={() => {
                    selectEdit && onClickApplyChange();
                    setSelectEdit((prev) => {
                      return !prev;
                    });
                  }}
                >
                  {!selectEdit ? "Edit" : "Apply change"}
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
