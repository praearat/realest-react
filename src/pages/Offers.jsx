import React, { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import ListingItem from "../components/ListingItem";

const Offers = () => {
  const [offerListings, setOfferListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchListing] = useState(null);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const q = query(
          collection(db, "listings"),
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        const querySnapshot = await getDocs(q);
        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastFetchListing(lastVisible);
        console.log("doc", lastVisible);
        const listings = [];
        querySnapshot.forEach((doc) => {
          listings.push({ id: doc.id, data: doc.data() });
        });
        setOfferListings(listings);
        setLoading(false);
      } catch (error) {
        console.log("fetchOfferListings error =", error);
      }
    };
    fetchOfferListings();
  }, []);

  const onFetchMoreListings = async () => {
    try {
      console.log("lastFetchedListing =", lastFetchedListing);
      const q = query(
        collection(db, "listings"),
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListing),
        limit(4)
      );
      const querySnapshot = await getDocs(q);
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastFetchListing(lastVisible);
      console.log("doc", lastVisible);
      const listings = [];
      querySnapshot.forEach((doc) => {
        listings.push({ id: doc.id, data: doc.data() });
      });
      setOfferListings((prev) => {
        return [...prev, ...listings];
      });
      setLoading(false);
    } catch (error) {
      console.log("fetchOfferListings error =", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="mt-6 text-center text-3xl font-bold">Offers</h1>
      {loading ? (
        <Spinner />
      ) : (
        offerListings &&
        (offerListings.length > 0 ? (
          <>
            <ul className="mt-6 mb-3 px-3 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {offerListings.map((listing) => {
                return (
                  <ListingItem
                    key={listing.id}
                    id={listing.id}
                    data={listing.data}
                  />
                );
              })}
            </ul>
            {lastFetchedListing && (
              <div className="flex justify-center">
                <button
                  className="text-center text-base bg-white rounded-md px-4 py-1 border border-gray-300 hover:border-gray-400"
                  onClick={onFetchMoreListings}
                >
                  Load more
                </button>
              </div>
            )}
          </>
        ) : (
          <p>There is no current offer.</p>
        ))
      )}
    </div>
  );
};

export default Offers;
