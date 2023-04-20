import React from "react";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

const ListingItem = (props) => {
  const { data, id } = props;
  return (
    <li className="relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-100 mx-2 mb-4">
      <Link to={`/category/${data.type}/${id}`}>
        <img
          className="h-[170px] w-full object-cover hover:scale-150 transition duration-200 ease-in"
          loading="lazy"
          src={data.imgUrls[0]}
          alt="Real estate"
        />
        <Moment
          className="absolute left-2 top-2 bg-cyan-900 uppercase text-white text-xs font-medium rounded-md px-2 py-1 shadow-lg"
          fromNow
        >
          {data.timestamp?.toDate()}
        </Moment>
        <div className="w-full p-4">
          <div className="flex items-center space-x-1">
            <MdLocationOn className="flex-shrink-0 h-4 w-4 text-green-600" />
            <p className="font-semibold text-gray-600 text-sm truncate">
              {data.address}
            </p>
          </div>
          <p className="text-xl font-bold text-gray-800">{data.name}</p>
          <p className="text-cyan-700 text-lg font-semibold">
            ฿
            {data.offer
              ? parseInt(data.discountedPrice)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : parseInt(data.regularPrice)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {data.type === "rent" && " / month"}
          </p>
          <div className="flex mt-2 space-x-3 text-sm font-normal">
            <p>
              {data.bedrooms}
              {data.bedrooms > 1 ? " Beds" : " Bed"}
            </p>
            <p>
              {data.bathrooms}
              {data.bathrooms > 1 ? " Baths" : " Bath"}
            </p>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default ListingItem;
