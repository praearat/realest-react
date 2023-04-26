import React, { useEffect, useState } from "react";
import Slider from "../components/Slider";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";

const Home = () => {
  const [offerListings, setOfferListings] = useState(null);
  const [rentListings, setRentListings] = useState(null);
  const [saleListings, setSaleListings] = useState(null);

  useEffect(() => {
    //FETCH OFFER LISTINGS
    const fetchOfferListings = async () => {
      try {
        const q = query(
          collection(db, "listings"),
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        const querySnapshot = await getDocs(q);
        const offerListings = [];
        querySnapshot.forEach((doc) => {
          return offerListings.push({ id: doc.id, data: doc.data() });
        });
        setOfferListings(offerListings);
      } catch (error) {
        console.log("fetchOfferListings error =", error);
      }
    };
    fetchOfferListings();

    //FETCH RENT LISTINGS
    const fetchRentListings = async () => {
      try {
        const q = query(
          collection(db, "listings"),
          where("type", "==", "rent"),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        const querySnapshot = await getDocs(q);
        const rentListings = [];
        querySnapshot.forEach((doc) => {
          return rentListings.push({ id: doc.id, data: doc.data() });
        });
        setRentListings(rentListings);
      } catch (error) {
        console.log("fetchRentListings error =", error);
      }
    };
    fetchRentListings();

    //FETCH SALE LISTINGS
    const fetchSaleListings = async () => {
      try {
        const q = query(
          collection(db, "listings"),
          where("type", "==", "sale"),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        const querySnapshot = await getDocs(q);
        const saleListings = [];
        querySnapshot.forEach((doc) => {
          return saleListings.push({ id: doc.id, data: doc.data() });
        });
        setSaleListings(saleListings);
      } catch (error) {
        console.log("fetchSaleListings error =", error);
      }
    };
    fetchSaleListings();
  }, []);

  return (
    <div>
      <Slider />
      <div className="max-w-6xl mx-auto my-10 space-y-6">
        {offerListings && offerListings.length > 0 && (
          <div className="px-3">
            <h2 className="pl-2 text-2xl font-semibold">Recent Offers</h2>
            <Link
              className="pl-2 text-sm text-blue-600 hover:text-blue-700 transition duration-150 ease-in-out"
              to="/offers"
            >
              Show more offers
            </Link>
            <ul className="mt-3 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {offerListings.map((offerListing) => {
                return (
                  <ListingItem
                    key={offerListing.id}
                    data={offerListing.data}
                    id={offerListing.id}
                  />
                );
              })}
            </ul>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className="px-3">
            <h2 className="pl-2 text-2xl font-semibold">Places for rent</h2>
            <Link
              className="pl-2 text-sm text-blue-600 hover:text-blue-700 transition duration-150 ease-in-out"
              to="/category/rent"
            >
              Show more places for rent
            </Link>
            <ul className="mt-3 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {rentListings.map((rentListing) => {
                return (
                  <ListingItem
                    key={rentListing.id}
                    data={rentListing.data}
                    id={rentListing.id}
                  />
                );
              })}
            </ul>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className="px-3">
            <h2 className="pl-2 text-2xl font-semibold">Places for sale</h2>
            <Link
              className="pl-2 text-sm text-blue-600 hover:text-blue-700 transition duration-150 ease-in-out"
              to="/category/sale"
            >
              Show more places for sale
            </Link>
            <ul className="mt-3 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {saleListings.map((saleListing) => {
                return (
                  <ListingItem
                    key={saleListing.id}
                    data={saleListing.data}
                    id={saleListing.id}
                  />
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
