import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import GoogleIcon from "./assets/png/google.svg";

function OAuth() {
  const navigate = useNavigate();
  const location = useLocation();

  const onGoogleHandler = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // Check if user exists in db
      const docReference = doc(db, "users", user.uid);
      const docSnap = await getDoc(docReference);
      // If user doesn't exist, create user
      if (!docSnap.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
        });
      }
      navigate("/profile");
    } catch (error) {
      toast.error("Could not authorize with Google");
    }
  };

  return (
    <div className=" flex flex-col items-center justify-center self-center p-6">
      <p>Sign {location.pathname === "/" ? "In" : "Up"} with</p>
      <button className="w-1/6 p-2" onClick={onGoogleHandler}>
        <img src={GoogleIcon} alt="google" />
      </button>
    </div>
  );
}

export default OAuth;
