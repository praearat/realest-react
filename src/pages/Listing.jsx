import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { MdLocationOn } from "react-icons/md";
import { FaBed, FaBath, FaParking } from "react-icons/fa";
import { BiChair } from "react-icons/bi";
import Spinner from "../components/Spinner";
import { AiOutlineShareAlt } from "react-icons/ai";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  EffectFade,
  Autoplay,
  Navigation,
  Pagination,
} from "swiper";
import "swiper/css/bundle";
import { getAuth } from "firebase/auth";
import ContactLandlord from "../components/ContactLandlord";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const Listing = () => {
  const auth = getAuth();
  const [contactLandlord, setContactLandlord] = useState(false);
  const [listingData, setListingData] = useState({});
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  SwiperCore.use([Autoplay, Navigation, Pagination]);

  useEffect(() => {
    const fetchListingData = async () => {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListingData(docSnap.data());
        setLoading(false);
      } else {
        toast.error("Something went wrong");
      }
    };
    fetchListingData();
  }, [params.listingId]);

  console.log("listingData =", listingData);

  if (loading) {
    return <Spinner />;
  }

  return (
    <main>
      {/* SWIPER */}
      <Swiper
        slidesPerView={1}
        navigation
        pagination={{ type: "progressbar" }}
        effect="fade"
        modules={[EffectFade]}
        autoplay={{ delay: 3000 }}
      >
        {listingData.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative w-full overflow-hidden h-[300px]"
              style={{
                background: `url(${listingData.imgUrls[index]}) center no-repeat`,
                backgroundSize: "cover",
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* SHARE BUTTON */}
      <button
        className="fixed right-5 top-20 z-50 flex justify-center items-center bg-white rounded-full h-10 w-10 shadow-md"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <AiOutlineShareAlt className="text-2xl" />
      </button>
      {shareLinkCopied && (
        <p className="fixed top-32 right-5 z-50 bg-white rounded-md px-3 py-1 font-medium text-xs">
          Link Copied!
        </p>
      )}

      {/* CARD */}
      <div className="flex flex-col md:flex-row max-w-6xl mt-6 mb-12 mx-4 lg:mx-auto rounded-lg p-4 bg-white shadow-md lg:space-x-5">
        {/* DETAILS */}
        <div className="w-full h-[100%] lg:h-[100%] px-4">
          {/* NAME */}
          <p className="font-bold text-cyan-900 text-2xl mb-3">
            {listingData.name}
          </p>
          {/* ADDRESS */}
          <p className="flex items-start font-semibold">
            <MdLocationOn className="text-green-600 flex-shrink-0 h-5 w-5 mr-1 mt-[1px]" />
            {listingData.address}
          </p>
          {/* PRICE */}
          <div className="flex mt-6">
            <div className="w-full px-4 py-2 bg-gray-100">
              <div className="flex items-center">
                {listingData.offer ? (
                  <>
                    <p className="text-base font-medium line-through text-gray-400">
                      ฿
                      {listingData.regularPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </p>

                    <p className="ml-3 text-red-800 text-2xl font-bold">
                      ฿
                      {listingData.discountedPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      {listingData.type === "rent" ? " / month" : ""}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="ml-3 text-red-800 text-2xl font-bold">
                      ฿
                      {listingData.regularPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      {listingData.type === "rent" ? " / month" : ""}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
          {/* TYPE AND DISCOUNT */}
          <div className="space-x-3 mt-3 flex items-center w-full">
            <p className="bg-green-800 w-full rounded-md flex justify-center items-center px-2 py-1 text-base font-medium text-white shadow-sm">
              For {listingData.type}
            </p>
            {listingData.offer && (
              <p className="bg-red-800 w-full rounded-md flex justify-center items-center px-2 py-1 text-base font-medium text-white shadow-sm">
                ฿
                {(
                  parseInt(listingData.regularPrice) -
                  parseInt(listingData.discountedPrice)
                )
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                discount
              </p>
            )}
          </div>
          {/* DESCRIPTION */}
          <p className="mt-6">
            <span className="font-semibold">Description</span>
            {/* {listingData.description} */}
            <div
              dangerouslySetInnerHTML={{
                __html: listingData.description.replace(/\n/g, "<br>"),
              }}
            />
          </p>
          {/* FACILITIES */}
          <div className="mt-6 grid grid-cols-2 md:flex md:space-x-4 lg:space-x-10">
            <p className="flex items-center text-sm font-semibold whitespace-nowrap mb-2">
              <FaBed className="text-lg mr-1" />
              {parseInt(listingData.bedrooms)}{" "}
              {parseInt(listingData.bedrooms) > 1 ? "Beds" : "Bed"}
            </p>
            <p className="flex items-center text-sm font-semibold whitespace-nowrap mb-2">
              <FaBath className="text-lg mr-1" />
              {parseInt(listingData.bathrooms)}{" "}
              {parseInt(listingData.bathrooms) > 1 ? "Baths" : "Bath"}
            </p>
            <p className="flex items-center text-sm font-semibold whitespace-nowrap mb-2">
              <FaParking className="text-lg mr-1" />
              {listingData.parking ? "Parking spot" : "No parking"}
            </p>
            <p className="flex items-center text-sm font-semibold whitespace-nowrap ml-0 !important mb-2">
              <BiChair className="text-lg mr-1" />
              {listingData.furnished ? "Furnished" : "Not furnished"}
            </p>
          </div>
          {/* CONTACT LANDLORD */}
          {listingData.user !== auth.currentUser?.uid && (
            <div className="mt-6">
              {!contactLandlord ? (
                <button
                  className="bg-cyan-600 rounded-md px-3 py-2 w-full uppercase text-base font-semibold text-white shadow-sm hover:bg-cyan-700 hover:shadow-md focus:bg-cyan-800 focus:shadow-lg transition duration-150 ease-in-out"
                  onClick={() => {
                    setContactLandlord(true);
                  }}
                >
                  Contact LandLord
                </button>
              ) : (
                <ContactLandlord listingData={listingData} />
              )}
            </div>
          )}
        </div>

        {/* MAP */}
        <div className="mt-6 mb-3 md:mt-0 px-4 w-full h-[300px] md:h-[400px] z-10 overflow-x-hidden">
          <MapContainer
            style={{ height: "100%", width: "100%" }}
            center={[listingData.geolocation.lat, listingData.geolocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[
                listingData.geolocation.lat,
                listingData.geolocation.lng,
              ]}
            >
              <Popup>
                <span className="font-bold">{listingData.name}</span>{" "}
                <span className="">{listingData.address}</span>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </main>
  );
};

export default Listing;
