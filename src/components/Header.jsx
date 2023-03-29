import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const matchLocation = (value) => {
    if (value === location.pathname) {
      return true;
    }
  };

  return (
    <div className="bg-white border-b shadow-sm sticky top-0 z-50">
      <header className="flex justify-between items-center px-3 max-w-6xl mx-auto">
        <div>
          <img
            src="https://propholic.com/wp-content/uploads/2018/02/asp-logo.jpg"
            alt="logo"
            className="h-14 cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          />
        </div>
        <div>
          <ul className="flex space-x-10">
            <li
              className={`cursor-pointer py-4 text-sm font-semibold ${
                matchLocation("/")
                  ? "text-black border-b-cyan-700 border-b-[3px]"
                  : "text-gray-400"
              }`}
              onClick={() => {
                navigate("/");
              }}
            >
              Home
            </li>
            <li
              className={`cursor-pointer py-4 text-sm font-semibold ${
                matchLocation("/offers")
                  ? "text-black border-b-cyan-700 border-b-[3px]"
                  : "text-gray-400"
              }`}
              onClick={() => {
                navigate("/offers");
              }}
            >
              Offers
            </li>
            <li
              className={`cursor-pointer py-4 text-sm font-semibold ${
                matchLocation("/sign-in")
                  ? "text-black border-b-cyan-700 border-b-[3px]"
                  : "text-gray-400"
              }`}
              onClick={() => {
                navigate("/sign-in");
              }}
            >
              Sign In
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
};

export default Header;
