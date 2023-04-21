import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate, useParams } from "react-router";

const EditListing = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [listingData, setListingData] = useState(null);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: true,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
  });
  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    description,
    offer,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude,
  } = formData;
  const params = useParams();

  ////////// CHECK USER REF OF LISTING DATA //////////

  useEffect(() => {
    console.log("listingData.user =", listingData);
    if (listingData && listingData?.user !== auth.currentUser.uid) {
      toast.error("You cannot edit this listing");
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.currentUser.uid, listingData]);

  ////////// FETCH LISTING DATA //////////

  const fetchListing = async () => {
    const docRef = doc(db, "listings", params.listingId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setListingData(docSnap.data());
      setFormData(docSnap.data());
      setLoading(false);
    } else {
      setLoading(false);
      navigate("/");
      toast.error("Listing does not exist");
    }
  };

  useEffect(() => {
    setLoading(true);
    console.log("listingId =", params.listingId);
    fetchListing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  ////////// ONCHANGE LISTING DATA //////////

  const onChange = (event) => {
    let boolean = null;
    if (event.target.value === "true") {
      boolean = true;
    }
    if (event.target.value === "false") {
      boolean = false;
    }
    if (event.target.files) {
      setFormData((prev) => {
        return {
          ...prev,
          images: event.target.files,
        };
      });
    } else {
      setFormData((prev) => {
        return { ...prev, [event.target.id]: boolean ?? event.target.value };
      });
    }
  };

  ////////// ON SUBMIT EDITED DATA //////////

  //ADDITIONAL RULES

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (parseInt(discountedPrice) >= +regularPrice) {
      setLoading(false);
      toast.error("Discounted price needs to be less than regular price");
      return;
    }
    if (images.length > 6) {
      setLoading(false);
      toast.error("Maximum 6 images are allowed");
      return;
    }

    //GET LAT AND LNG FROM GEOLOCATION

    let geolocation = {};
    if (geolocationEnabled) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
      );
      const data = await response.json();
      console.log(data);
      //   geolocation.lat = data?.results?.[0]?.geometry?.location?.lat ?? 0;
      if (data.status === "OK") {
        geolocation.lat = data.results[0].geometry.location.lat;
        geolocation.lng = data.results[0].geometry.location.lng;
      } else if (data.status === "ZERO_RESULTS") {
        setLoading(false);
        toast.error("Please enter a correct address");
        return;
      } else {
        setLoading(false);
        toast.error("Something went wrong");
        return;
      }
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
    }

    //UPLOAD IMAGES TO STORAGE & GET IMAGE URLS

    //UPLOAD IMAGES TO STORAGE
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);
        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
              // no default
            }
          },
          (error) => {
            // Handle unsuccessful uploads
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    //GET IMAGE URLS
    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      console.log("image upload error", error);
      toast.error("Images cannot be uploaded");
      return;
    });
    console.log("imgUrls", imgUrls);

    //SAVE DATA TO DATABASE

    const formDataCopy = {
      ...formData,
      geolocation,
      imgUrls,
      timestamp: serverTimestamp(),
      user: auth.currentUser.uid,
    };
    delete formDataCopy.images;
    delete formDataCopy.latitude;
    delete formDataCopy.longitude;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;
    const docRef = doc(db, "listings", params.listingId);
    await updateDoc(docRef, formDataCopy);
    setLoading(false);
    toast.success("Listing was edited successfully");
    navigate(`/category/${type}/${docRef.id}`);
  };

  ////////// LOADING PAGE //////////

  if (loading) {
    return <Spinner />;
  }

  return (
    <main>
      <h1 className="text-3xl text-center font-bold mt-6">Edit Listing</h1>
      <form className="max-w-md mx-auto px-3" onSubmit={onSubmit}>
        <p className="mt-6 mb-1 text-base font-semibold">Sell or Rent</p>
        <div className="flex justify-center items-center space-x-6">
          <button
            className={`w-full px-7 py-3 rounded-md shadow-sm hover:shadow-md text-sm font-medium ${
              type === "sale" ? "bg-cyan-800 text-white" : "bg-white text-black"
            }`}
            type="button"
            id="type"
            value="sale"
            onClick={onChange}
          >
            SELL
          </button>
          <button
            className={`w-full px-7 py-3 rounded-md shadow-sm hover:shadow-md text-sm font-medium ${
              type === "rent" ? "bg-cyan-800 text-white" : "bg-white text-black"
            }`}
            type="button"
            id="type"
            value="rent"
            onClick={onChange}
          >
            RENT
          </button>
        </div>
        <p className="mt-3 mb-1 text-base font-semibold">Name</p>
        <input
          className="w-full rounded-md bg-white border-gray-300 px-5 py-3 focus:bg-white focus:border-cyan-700 text-base transition duration-150 ease-in-out"
          type="text"
          id="name"
          value={name}
          maxLength="32"
          minLength="10"
          placeholder="Name"
          required
          onChange={onChange}
        />
        <div className="flex space-x-6">
          <div>
            <p className="mt-3 mb-1 text-base font-semibold">Bedrooms</p>
            <input
              className="w-full rounded-md bg-white border-gray-300 px-5 py-3 focus:bg-white focus:border-cyan-700 text-base transition duration-150 ease-in-out"
              type="number"
              id="bedrooms"
              value={bedrooms}
              min="1"
              max="50"
              required
              onChange={onChange}
            />
          </div>
          <div>
            <p className="mt-3 mb-1 text-base font-semibold">Bathrooms</p>
            <input
              className="w-full rounded-md bg-white border-gray-300 px-5 py-3 focus:bg-white focus:border-cyan-700 text-base transition duration-150 ease-in-out"
              type="number"
              id="bathrooms"
              value={bathrooms}
              min="1"
              max="50"
              required
              onChange={onChange}
            />
          </div>
        </div>
        <p className="mt-3 mb-1 text-base font-semibold">Parking Spot</p>
        <div className="flex justify-center items-center space-x-6">
          <button
            className={`w-full px-7 py-3 rounded-md shadow-sm hover:shadow-md text-sm font-medium ${
              parking === true
                ? "bg-cyan-800 text-white"
                : "bg-white text-black"
            }`}
            type="button"
            id="parking"
            value={true}
            onClick={onChange}
          >
            YES
          </button>
          <button
            className={`w-full px-7 py-3 rounded-md shadow-sm hover:shadow-md text-sm font-medium ${
              parking === false
                ? "bg-cyan-800 text-white"
                : "bg-white text-black"
            }`}
            type="button"
            id="parking"
            value={false}
            onClick={onChange}
          >
            NO
          </button>
        </div>
        <p className="mt-3 mb-1 text-base font-semibold">Furnished</p>
        <div className="flex justify-center items-center space-x-6">
          <button
            className={`w-full px-7 py-3 rounded-md shadow-sm hover:shadow-md text-sm font-medium ${
              furnished === true
                ? "bg-cyan-800 text-white"
                : "bg-white text-black"
            }`}
            type="button"
            id="furnished"
            value={true}
            onClick={onChange}
          >
            YES
          </button>
          <button
            className={`w-full px-7 py-3 rounded-md shadow-sm hover:shadow-md text-sm font-medium ${
              furnished === false
                ? "bg-cyan-800 text-white"
                : "bg-white text-black"
            }`}
            type="button"
            id="furnished"
            value={false}
            onClick={onChange}
          >
            NO
          </button>
        </div>
        <p className="mt-3 mb-1 text-base font-semibold">Address</p>
        <textarea
          className="w-full rounded-md bg-white border-gray-300 px-5 py-3 focus:bg-white focus:border-cyan-700 text-base transition duration-150 ease-in-out"
          type="text"
          id="address"
          value={address}
          placeholder="Address"
          required
          onChange={onChange}
        />
        {!geolocationEnabled && (
          <div className="flex space-x-6">
            <div className="w-full">
              <p className="mt-1 mb-1 text-base font-semibold">Latitude</p>
              <input
                className="w-full rounded-md bg-white border-gray-300 px-5 py-3 focus:bg-white focus:border-cyan-700 text-base transition duration-150 ease-in-out"
                type="number"
                id="latitude"
                value={latitude}
                min={-90}
                max={90}
                required
                onChange={onChange}
              />
            </div>
            <div className="w-full">
              <p className="mt-1 mb-1 text-base font-semibold">Longitude</p>
              <input
                className="w-full rounded-md bg-white border-gray-300 px-5 py-3 focus:bg-white focus:border-cyan-700 text-base transition duration-150 ease-in-out"
                type="number"
                id="longitude"
                value={longitude}
                min={-180}
                max={180}
                required
                onChange={onChange}
              />
            </div>
          </div>
        )}
        <p className="mt-3 mb-1 text-base font-semibold">Description</p>
        <textarea
          className="w-full rounded-md bg-white border-gray-300 px-5 py-3 focus:bg-white focus:border-cyan-700 text-base transition duration-150 ease-in-out"
          type="text"
          id="description"
          value={description}
          placeholder="Description"
          required
          onChange={onChange}
        />
        <p className="mt-3 mb-1 text-base font-semibold">Offer</p>
        <div className="flex justify-center items-center space-x-6">
          <button
            className={`w-full px-7 py-3 rounded-md shadow-sm hover:shadow-md text-sm font-medium ${
              offer === true ? "bg-cyan-800 text-white" : "bg-white text-black"
            }`}
            type="button"
            id="offer"
            value={true}
            onClick={onChange}
          >
            YES
          </button>
          <button
            className={`w-full px-7 py-3 rounded-md shadow-sm hover:shadow-md text-sm font-medium ${
              offer === false ? "bg-cyan-800 text-white" : "bg-white text-black"
            }`}
            type="button"
            id="offer"
            value={false}
            onClick={onChange}
          >
            NO
          </button>
        </div>
        <p className="mt-3 mb-1 text-base font-semibold">Regular Price</p>
        <div className="flex items-center">
          <input
            className="w-full rounded-md bg-white border-gray-300 px-5 py-3 focus:bg-white focus:border-cyan-700 text-base transition duration-150 ease-in-out"
            type="number"
            id="regularPrice"
            value={regularPrice}
            min="0"
            required
            onChange={onChange}
          />
          {type === "sale" ? (
            <p className="w-full ml-5">$</p>
          ) : (
            <p className="w-full ml-5">$ / month</p>
          )}
        </div>
        {offer && (
          <div>
            <p className="mt-3 mb-1 text-base font-semibold">
              Discounted Price
            </p>
            <div className="flex items-center">
              <input
                className="w-full rounded-md bg-white border-gray-300 px-5 py-3 focus:bg-white focus:border-cyan-700 text-base transition duration-150 ease-in-out"
                type="number"
                id="discountedPrice"
                value={discountedPrice}
                min="0"
                required={offer}
                onChange={onChange}
              />
              {type === "sale" ? (
                <p className="w-full ml-5">$</p>
              ) : (
                <p className="w-full ml-5">$ / month</p>
              )}
            </div>
          </div>
        )}
        <p className="mt-3 mb-1 text-base font-semibold">Images</p>
        <p className="text-sm">The first image will be the cover (max 6). </p>
        <p className="text-sm">Max file size is 2MB.</p>
        <input
          className="w-full mt-1 rounded-md bg-white border border-gray-300 px-5 py-3 focus:bg-white focus:border-cyan-700 text-base text-gray-600 transition duration-150 ease-in-out"
          type="file"
          accept=".jpg,.jpeg, .png"
          id="images"
          multiple
          required
          onChange={onChange}
        />
        <button
          className="w-full my-10 px-5 py-3 bg-cyan-600 text-sm font-semibold text-white rounded-md shadow hover:bg-cyan-700 hover:shadow-md focus:bg-cyan-800 focus:shadow-lg transition duration-150 ease-in-out"
          type="submit"
        >
          EDIT LISTING
        </button>
      </form>
    </main>
  );
};

export default EditListing;
