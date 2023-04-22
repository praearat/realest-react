import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { useParams } from "react-router";
import { toast } from "react-toastify";
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

const Listing = () => {
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
    </main>
  );
};

export default Listing;
