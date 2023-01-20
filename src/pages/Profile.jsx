import { useState } from "react";
import Navbar from "../components/Navbar";
import { getAuth, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { db } from "../firebase.config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import ProfileImage from "../components/assets/png/profile.png";

function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
    imgUrl: auth.currentUser.photoURL,
  });

  const { name, email, imgUrl } = formData;

  const onLogoutHandler = () => {
    auth.signOut();
    navigate("/");
  };

  const changeDetailsHandler = () => {
    setChangeDetails((prevState) => !prevState);
  };

  const onSubmitHandler = async () => {
    setChangeDetails((prevState) => !prevState);
    console.log(auth.currentUser);
    console.log(formData);
    // Store image
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, "images/" + fileName);

        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
          },
          (error) => {
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    // storeImage();
    const storedImage = await storeImage(imgUrl).catch(() => {
      toast.error("Image is not uploaded");
      return;
    });

    console.log(storedImage);

    try {
      if (
        auth.currentUser.displayName !== name ||
        auth.currentUser.photoURL !== storedImage
      ) {
        // Update display name in firebase
        await updateProfile(auth.currentUser, {
          displayName: name,
          photoURL: storedImage,
        });

        // Update in firestore
        const userReference = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userReference, {
          name: name,
          photoURL: storedImage,
        });
      }
    } catch (error) {
      toast.error("Could not update profile details.");
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

  // Image Url
  const uploadImageHandler = (e) => {
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        imgUrl: e.target.files[0],
      }));
    }
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
          src={imgUrl === "" ? ProfileImage : imgUrl}
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
          <form>
            <fieldset>
              <input
                type="text"
                value={name}
                className={
                  !changeDetails
                    ? "w-full text-xl px-1 mb-2 outline-0"
                    : "w-full text-xl px-1 mb-2 border-2 outline-0 bg-gray-100"
                }
                id="name"
                disabled={!changeDetails}
                onChange={inputChangeHandler}
              />
            </fieldset>
            <fieldset>
              <input
                type="file"
                name="picture"
                id="picture"
                onChange={uploadImageHandler}
                accept=".jpg, .png, .jpeg"
                max="1"
                disabled={!changeDetails}
              />
            </fieldset>
            <p className="px-1 py-3">{email}</p>
          </form>
        </div>
      </main>
    </>
  );
}

export default Profile;
