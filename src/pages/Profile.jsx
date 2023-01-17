import { useState } from "react";
import Navbar from "../components/Navbar";
import { getAuth, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ProfileImage from "../components/assets/png/profile.png";

function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;

  const onLogoutHandler = () => {
    auth.signOut();
    navigate("/");
  };

  const changeDetailsHandler = () => {
    setChangeDetails((prevState) => !prevState);
  };

  const onSubmitHandler = async () => {
    setChangeDetails((prevState) => !prevState);
    try {
      if (auth.currentUser.displayName !== name) {
        // Update display name in firebase
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // Update in firestore
        const userReference = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userReference, {
          name: name,
        });
      }
    } catch (error) {
      toast.error("Could not update profile details.");
      console.log(error);
    }
  };

  const inputChangeHandler = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const cancelInputHandler = () => {
    setChangeDetails((prevState) => !prevState);
  };

  return (
    <>
      <Navbar />
      <header className="w-full flex justify-between items-center p-5">
        <h2 className="text-2xl ">My Profile</h2>
        <button
          className="bg-teal-500 px-4 py-1 border-0 rounded-full text-xl text-white transition-all hover:bg-teal-600"
          onClick={onLogoutHandler}
        >
          Log out
        </button>
      </header>
      <main className="w-full flex flex-col items-center p-5">
        <img
          src={ProfileImage}
          className="w-1/2 rounded-full mb-5"
          alt="profile img"
        />
        <div className="w-full rounded-lg bg-white p-5 font-semibold">
          <div className="flex justify-between items-center pb-5">
            <h3 className="text-sm font-normal ">Personal Details</h3>
            <span
              className="text-sm text-orange-400 font-bold hover:text-orange-500 cursor-pointer"
              onClick={!changeDetails ? changeDetailsHandler : onSubmitHandler}
            >
              {changeDetails ? "Done" : "Change"}
            </span>
            {changeDetails && (
              <span
                className="text-sm text-orange-400 font-bold hover:text-orange-500 cursor-pointer"
                onClick={cancelInputHandler}
              >
                Cancel
              </span>
            )}
          </div>
          <input
            type="text"
            value={name}
            className={
              !changeDetails
                ? "w-full text-xl px-1 outline-0"
                : "w-full text-xl px-1 border-2 outline-0"
            }
            id="name"
            disabled={!changeDetails}
            onChange={inputChangeHandler}
          />
          <p className="px-1 py-3">{email}</p>
        </div>
      </main>
    </>
  );
}

export default Profile;
