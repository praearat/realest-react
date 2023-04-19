import React from "react";

const ListingItem = (props) => {
  const { listingData } = props;
  return <div>{listingData.name}</div>;
};

export default ListingItem;
