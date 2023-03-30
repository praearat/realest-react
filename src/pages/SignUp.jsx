import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "../firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [inputData, setInputData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = inputData;
  const navigate = useNavigate();

  const onInputChange = (event) => {
    setInputData((prevData) => {
      return { ...prevData, [event.target.id]: event.target.value };
    });
  };

  const onSignUp = async (event) => {
    event.preventDefault();

    try {
      //ส่งข้อมูลในการ Sign up เข้าไปที่ Auth
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { user } = userCredential;
      console.log("user", user);
      //ส่งข้อมูล 'ชื่อ' เข้าไปเก็บด้วย
      await updateProfile(auth.currentUser, {
        displayName: name,
      });
      //จัดระเบียบข้อมูลที่จะนำไปเก็บใน database และนำไปเก็บโดยใช้ setDoc
      const inputDataCopy = { ...inputData };
      delete inputDataCopy.password;
      inputDataCopy.timestamp = serverTimestamp();
      await setDoc(doc(db, "users", user.uid), inputDataCopy);
      //หลัง Sign up สำเร็จให้พา user ไปหน้า Home พร้อมทั้งส่ง Noti แจ้ง
      navigate("/");
      toast.success("Sign up was successful");
    } catch (error) {
      toast.error("Something went wrong with the registration");
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("error", error);
      console.log("errorCode", errorCode);
      console.log("errorMessage", errorMessage);
    }

    //   const auth = getAuth();
    //   createUserWithEmailAndPassword(auth, email, password)
    //     .then((userCredential) => {
    //       const user = userCredential.user;
    //       console.log("user", user);
    //     })
    //     .catch((error) => {
    //       const errorCode = error.code;
    //       const errorMessage = error.message;
    //       console.log("error", error);
    //       console.log("errorCode", errorCode);
    //       console.log("errorMessage", errorMessage);
    //     });
    // };
  };

  return (
    <section>
      <h1 className="text-3xl text-center font-bold mt-6">Sign Up</h1>

      <div className="flex justify-center items-center flex-wrap mt-6 mx-12 mb-12">
        <div className="w-full md:w-[67%] lg:w-[50%] mb-6 lg:mb-0">
          <img
            className="w-full rounded-2xl"
            src="https://i0.wp.com/www.iurban.in.th/wp-content/uploads/2019/02/river-hight-view-rv2.jpg?ssl=1"
            alt="sign-in"
          />
        </div>

        <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-10">
          <form onSubmit={onSignUp}>
            <input
              className="w-full border-gray-300 rounded-md transition text-sm px-5 py-3 mb-3"
              type="text"
              id="name"
              placeholder="Full name"
              onChange={onInputChange}
            />
            <input
              className="w-full border-gray-300 rounded-md transition text-sm px-5 py-3 mb-3"
              type="email"
              id="email"
              placeholder="Email"
              onChange={onInputChange}
            />
            <div className="relative">
              <input
                className="w-full border-gray-300 rounded-md transition text-sm px-5 py-3 mb-3"
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                onChange={onInputChange}
              />
              <div className="cursor-pointer absolute text-xl bottom-6 right-5 ">
                {showPassword ? (
                  <AiFillEyeInvisible
                    onClick={() => {
                      setShowPassword(false);
                    }}
                  />
                ) : (
                  <AiFillEye
                    onClick={() => {
                      setShowPassword(true);
                    }}
                  />
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <p className="text-sm mb-3">
                Have an account?{" "}
                <Link className="text-red-500 hover:text-red-600" to="/sign-in">
                  Sign In
                </Link>
              </p>
              <Link
                className="text-sm text-blue-600 hover:text-blue-700"
                to="/forgot-password"
              >
                Forgot password?
              </Link>
            </div>

            <button
              className="bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 w-full rounded-md py-3 text-sm text-white text-center font-medium shadow-sm hover:shadow transition ease-in-out"
              type="submit"
            >
              SIGN UP
            </button>
            <div className="flex items-center my-2 before:border-t before:border-gray-300 before:flex-1 after:border-t after:border-gray-300 after:flex-1">
              <p className="my-1 mx-3 text-center text-sm font-medium">OR</p>
            </div>
            <OAuth />
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
