import React from "react";
import spinner from "../assets/svg/spinner.svg";

const Spinner = () => {
  return (
    <div className="bg-black bg-opacity-50 flex justify-center items-center fixed top-0 right-0 bottom-0 left-0 z-50">
      <img className="h-16" src={spinner} alt="Loading..." />
    </div>
  );
};

export default Spinner;
