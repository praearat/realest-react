import React, { useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  EffectFade,
  Autoplay,
  Navigation,
  Pagination,
} from "swiper";
import "swiper/css/bundle";
import { useNavigate } from "react-router";

const Slider = () => {
  const [loading, setLoading] = useState(true);
  const [sliderListings, setSliderListings] = useState([]);
  const navigate = useNavigate();
  SwiperCore.use([Autoplay, Navigation, Pagination]);

  useEffect(() => {
    const fetchListings = async () => {
      const listingsRef = collection(db, "listings");
      const q = query(listingsRef, orderBy("timestamp", "desc"), limit(3));
      const querySnapshot = await getDocs(q);
      let listings = [];
      querySnapshot.forEach((doc) => {
        return listings.push({ id: doc.id, data: doc.data() });
      });
      setSliderListings(listings);
      setLoading(false);
    };
    fetchListings();
  }, []);

  if (loading) {
    return <Spinner />;
  }
  if (sliderListings.length === 0) {
    return <></>;
  }

  return (
    sliderListings && (
      <div>
        <Swiper
          slidesPerView={1}
          navigation
          pagination={{ type: "progressbar" }}
          effect="fade"
          modules={[EffectFade]}
          autoplay={{ delay: 3000 }}
        >
          {sliderListings.map((listing) => {
            return (
              <SwiperSlide
                key={listing.id}
                onClick={() => {
                  navigate(`/category/${listing.data.type}/${listing.id}`);
                }}
              >
                <div
                  className="relative w-full h-[300px] overflow-hidden"
                  style={{
                    background: `url(${listing.data.imgUrls[0]}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                >
                  <p className="absolute left-0 top-1 text-base text-white font-medium bg-cyan-700 opacity-90 max-w-[90%] px-5 py-2 rounded-br-3xl shadow-lg">
                    {listing.data.name}
                  </p>
                  <p className="absolute left-3 bottom-3 text-base text-white font-medium bg-red-700 opacity-90 max-w-[90%] px-4 py-1 rounded-full shadow-lg">
                    ฿
                    {listing.data.offer
                      ? listing.data.discountedPrice
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      : listing.data.regularPrice
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    {listing.data.type === "rent" && " / month"}
                  </p>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    )
  );
};

export default Slider;
