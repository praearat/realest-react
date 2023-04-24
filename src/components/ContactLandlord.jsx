import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";

const ContactLandlord = ({ listingData }) => {
  const [landlordData, setLandlordData] = useState(null);
  const [message, setMessage] = useState("");

  const onChangeMessage = (event) => {
    setMessage(event.target.value);
  };

  useEffect(() => {
    const getLandlordData = async () => {
      const docRef = doc(db, "users", listingData.user);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLandlordData(docSnap.data());
      }
    };
    getLandlordData();
  }, [listingData.user]);

  return (
    <>
      {landlordData !== null && (
        <div>
          <p className="text-gray-500 text-sm mb-2">
            Contact{" "}
            <span className="font-medium text-cyan-800">
              {landlordData.name}
            </span>{" "}
            for the{" "}
            <span className="font-medium text-cyan-800">
              {listingData.name}
            </span>{" "}
            for {listingData.type}
          </p>
          <textarea
            className="w-full border-1 border border-gray-300 rounded-md px-4"
            placeholder="Message"
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={onChangeMessage}
          />
          <a
            href={`mailto:${landlordData.email}?Subject=${listingData.name}&body=${message}`}
          >
            <button className="mt-1 uppercase text-base text-white font-semibold bg-cyan-600 rounded-md w-full px-3 py-2 shadow hover:bg-cyan-700 hover:shadow-md focus:bg-cyan-800 focus:shadow-lg">
              send message
            </button>
          </a>
          {landlordData.email}
        </div>
      )}
    </>
  );
};

export default ContactLandlord;
