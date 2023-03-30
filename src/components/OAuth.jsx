import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { db } from "../firebase";

const OAuth = () => {
  const navigate = useNavigate();

  const onGoogleClick = async () => {
    try {
      //สร้าง Sign in with pop up
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: "select_account",
      });
      const result = await signInWithPopup(auth, provider);
      const { user } = result;
      console.log("user", user);
      //check database ว่ามีข้อมูลคนนี้รึยัง
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      //ถ้ายังไม่มี บันทึกลงไป
      if (!docSnap.exists()) {
        setDoc(docRef, {
          email: user.email,
          name: user.displayName,
          timestamp: serverTimestamp(),
        });
      }
      navigate("/");
    } catch (error) {
      toast.error("Could not authorize with Google");
      console.log(error);
    }
  };

  return (
    <button
      type="button"
      onClick={onGoogleClick}
      className="flex justify-center items-center bg-red-700 hover:bg-red-800 active:bg-red-900 w-full rounded-md py-3 text-sm text-white text-center font-medium shadow-sm hover:shadow transition ease-in-out"
    >
      <FcGoogle className="text-2xl bg-white rounded-full mr-2" />
      CONTINUE WITH GOOGLE
    </button>
  );
};

export default OAuth;
