import React from "react";
import { FcGoogle } from "react-icons/fc";

const OAuth = () => {
  return (
    <button
      className="flex justify-center items-center bg-red-700 hover:bg-red-800 active:bg-red-900 w-full rounded-md py-3 text-sm text-white text-center font-medium shadow-sm hover:shadow transition ease-in-out"
      type="submit"
    >
      <FcGoogle className="text-2xl bg-white rounded-full mr-2" />
      CONTINUE WITH GOOGLE
    </button>
  );
};

export default OAuth;
