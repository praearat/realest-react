import React, { useState } from "react";

const CreateListing = () => {
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: true,
    regularPrice: 0,
    discountedPrice: 0,
  });
  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    description,
    offer,
    regularPrice,
    discountedPrice,
  } = formData;

  const onChange = () => {};

  return (
    <main>
      <h1 className="text-3xl text-center font-bold mt-6">Create a Listing</h1>
      <form className="max-w-md mx-auto px-3">
        <p className="mt-6 mb-1 text-base font-semibold">Sell or Rent</p>
        <div className="flex justify-center items-center space-x-6">
          <button
            className={`w-full px-7 py-3 rounded-md shadow-sm hover:shadow-md text-sm font-medium ${
              type === "sale" ? "bg-cyan-800 text-white" : "bg-white text-black"
            }`}
            type="button"
            id="type"
            value="sell"
            onClick={onChange}
          >
            SELL
          </button>
          <button
            className={`w-full px-7 py-3 rounded-md shadow-sm hover:shadow-md text-sm font-medium ${
              type === "rent" ? "bg-cyan-800 text-white" : "bg-white text-black"
            }`}
            type="button"
            id="type"
            value="rent"
            onClick={onChange}
          >
            RENT
          </button>
        </div>
        <p className="mt-3 mb-1 text-base font-semibold">Name</p>
        <input
          className="w-full rounded-md bg-white border-gray-300 px-5 py-3 focus:bg-white focus:border-cyan-700 text-base transition duration-150 ease-in-out"
          type="text"
          id="name"
          value={name}
          maxLength="32"
          minLength="10"
          placeholder="Name"
          required
          onChange={onChange}
        />
        <div className="flex space-x-6">
          <div>
            <p className="mt-3 mb-1 text-base font-semibold">Bedrooms</p>
            <input
              className="w-full rounded-md bg-white border-gray-300 px-5 py-3 focus:bg-white focus:border-cyan-700 text-base transition duration-150 ease-in-out"
              type="number"
              id="bedrooms"
              value={bedrooms}
              min="1"
              max="50"
              required
              onChange={onChange}
            />
          </div>
          <div>
            <p className="mt-3 mb-1 text-base font-semibold">Bathrooms</p>
            <input
              className="w-full rounded-md bg-white border-gray-300 px-5 py-3 focus:bg-white focus:border-cyan-700 text-base transition duration-150 ease-in-out"
              type="number"
              id="bathrooms"
              value={bathrooms}
              min="1"
              max="50"
              required
              onChange={onChange}
            />
          </div>
        </div>
        <p className="mt-3 mb-1 text-base font-semibold">Parking Spot</p>
        <div className="flex justify-center items-center space-x-6">
          <button
            className={`w-full px-7 py-3 rounded-md shadow-sm hover:shadow-md text-sm font-medium ${
              parking === true
                ? "bg-cyan-800 text-white"
                : "bg-white text-black"
            }`}
            type="button"
            id="parking"
            value={true}
            onClick={onChange}
          >
            YES
          </button>
          <button
            className={`w-full px-7 py-3 rounded-md shadow-sm hover:shadow-md text-sm font-medium ${
              parking === false
                ? "bg-cyan-800 text-white"
                : "bg-white text-black"
            }`}
            type="button"
            id="parking"
            value={false}
            onClick={onChange}
          >
            NO
          </button>
        </div>
        <p className="mt-3 mb-1 text-base font-semibold">Furnished</p>
        <div className="flex justify-center items-center space-x-6">
          <button
            className={`w-full px-7 py-3 rounded-md shadow-sm hover:shadow-md text-sm font-medium ${
              furnished === true
                ? "bg-cyan-800 text-white"
                : "bg-white text-black"
            }`}
            type="button"
            id="furnished"
            value={true}
            onClick={onChange}
          >
            YES
          </button>
          <button
            className={`w-full px-7 py-3 rounded-md shadow-sm hover:shadow-md text-sm font-medium ${
              furnished === false
                ? "bg-cyan-800 text-white"
                : "bg-white text-black"
            }`}
            type="button"
            id="furnished"
            value={false}
            onClick={onChange}
          >
            NO
          </button>
        </div>
        <p className="mt-3 mb-1 text-base font-semibold">Address</p>
        <textarea
          className="w-full rounded-md bg-white border-gray-300 px-5 py-3 focus:bg-white focus:border-cyan-700 text-base transition duration-150 ease-in-out"
          type="text"
          id="address"
          value={address}
          placeholder="Address"
          required
          onChange={onChange}
        />
        <p className="mt-3 mb-1 text-base font-semibold">Description</p>
        <textarea
          className="w-full rounded-md bg-white border-gray-300 px-5 py-3 focus:bg-white focus:border-cyan-700 text-base transition duration-150 ease-in-out"
          type="text"
          id="description"
          value={description}
          placeholder="Description"
          required
          onChange={onChange}
        />
        <p className="mt-3 mb-1 text-base font-semibold">Offer</p>
        <div className="flex justify-center items-center space-x-6">
          <button
            className={`w-full px-7 py-3 rounded-md shadow-sm hover:shadow-md text-sm font-medium ${
              offer === true ? "bg-cyan-800 text-white" : "bg-white text-black"
            }`}
            type="button"
            id="offer"
            value={true}
            onClick={onChange}
          >
            YES
          </button>
          <button
            className={`w-full px-7 py-3 rounded-md shadow-sm hover:shadow-md text-sm font-medium ${
              offer === false ? "bg-cyan-800 text-white" : "bg-white text-black"
            }`}
            type="button"
            id="offer"
            value={false}
            onClick={onChange}
          >
            NO
          </button>
        </div>
        <p className="mt-3 mb-1 text-base font-semibold">Regular Price</p>
        <div className="flex items-center">
          <input
            className="w-full rounded-md bg-white border-gray-300 px-5 py-3 focus:bg-white focus:border-cyan-700 text-base transition duration-150 ease-in-out"
            type="number"
            id="regularPrice"
            value={regularPrice}
            min="0"
            required
            onChange={onChange}
          />
          {type === "sale" ? (
            <p className="w-full ml-5">$</p>
          ) : (
            <p className="w-full ml-5">$ / month</p>
          )}
        </div>
        {offer && (
          <div>
            <p className="mt-3 mb-1 text-base font-semibold">
              Discounted Price
            </p>
            <div className="flex items-center">
              <input
                className="w-full rounded-md bg-white border-gray-300 px-5 py-3 focus:bg-white focus:border-cyan-700 text-base transition duration-150 ease-in-out"
                type="number"
                id="discountedPrice"
                value={discountedPrice}
                min="0"
                required={offer}
                onChange={onChange}
              />
              {type === "sale" ? (
                <p className="w-full ml-5">$</p>
              ) : (
                <p className="w-full ml-5">$ / month</p>
              )}
            </div>
          </div>
        )}
        <p className="mt-3 mb-1 text-base font-semibold">Images</p>
        <p>The first image will be the cover (max 6).</p>
        <input
          className="w-full mt-1 rounded-md bg-white border border-gray-300 px-5 py-3 focus:bg-white focus:border-cyan-700 text-base text-gray-600 transition duration-150 ease-in-out"
          type="file"
          accept=".jpg,.jpeg, .png"
          id="images"
          multiple
          required
          onChange={onChange}
        />
        <button
          className="w-full my-10 px-5 py-3 bg-cyan-600 text-sm font-semibold text-white rounded-md shadow hover:bg-cyan-700 hover:shadow-md focus:bg-cyan-800 focus:shadow-lg transition duration-150 ease-in-out"
          type="submit"
        >
          CREATE LISTING
        </button>
      </form>
    </main>
  );
};

export default CreateListing;
