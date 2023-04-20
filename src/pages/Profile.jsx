import { getAuth, updateProfile } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { BiHomeAlt } from "react-icons/bi";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";

const Profile = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = userData;
  const [selectEdit, setSelectEdit] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // console.log("userData =", userData);

  const onSignOut = () => {
    auth.signOut();
    navigate("/");
  };

  const onClickApplyChange = async () => {
    try {
      if (name !== auth.currentUser.displayName) {
        updateProfile(auth.currentUser, { displayName: name });
        // console.log("currentUser =", auth.currentUser);
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

  const onEditListing = (listingId) => {
    navigate(`/edit-listing/${listingId}`);
  };
  const onDeleteListing = async (listingId) => {
    if (window.confirm("Are you sure you want to delete?")) {
      await deleteDoc(doc(db, "listings", listingId));
      setUserListings((prevListings) => {
        prevListings.filter((prevListing) => prevListing.id !== listingId);
      });
    }
  };

  useEffect(() => {
    const fetchUserListings = async () => {
      const q = query(
        collection(db, "listings"),
        where("user", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);
      // const userListingsData = querySnapshot.map((userListing) => {
      //   return { id: userListing.id, data: userListing.data() };
      // });
      let userListingsData = [];
      querySnapshot.forEach((userListing) => {
        return userListingsData.push({
          id: userListing.id,
          data: userListing.data(),
        });
      });
      setUserListings(userListingsData);
      setLoading(false);
    };
    // console.log("userListings =", userListings);
    fetchUserListings();
  }, [auth.currentUser.uid]);

  return (
    <>
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
          <button
            className="w-full mt-3 py-3 text-white text-sm font-medium bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 rounded-md shadow-sm hover:shadow transition ease-in-out"
            type="submit"
          >
            <Link
              className="flex justify-center items-center"
              to="/create-listing"
            >
              <BiHomeAlt className="mr-2 text-3xl text-cyan-600 bg-white rounded-full p-1" />
              SELL OR RENT YOUR HOME{" "}
            </Link>
          </button>
        </div>
        <h1 className="text-2xl text-center font-bold mt-10">My Listings</h1>
        <div className=" w-full max-w-7xl mt-6 px-3 mx-auto">
          {!loading && (
            <>
              <ul className="sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {userListings?.map((userListing) => (
                  <ListingItem
                    key={userListing.id}
                    id={userListing.id}
                    data={userListing.data}
                    onEdit={onEditListing}
                    onDelete={onDeleteListing}
                  />
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default Profile;
