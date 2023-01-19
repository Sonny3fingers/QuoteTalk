import React, { useState } from "react";
import ProfileImg from "../assets/png/profile.png";
import SmallButton from "../SmallButton";
import { getAuth } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase.config";
import { toast } from "react-toastify";

function CreatePost() {
  const [postData, setPostData] = useState({});

  const onChangeHandler = (e) => {
    setPostData((prevState) => ({
      ...prevState,
      content: e.target.value,
      likes: 0,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();

      await addDoc(collection(db, "posts"), postData, {
        userId: auth.currentUser.uid,
      });

      toast.success("Created post.");
    } catch (error) {
      toast.error("Could not post data.");
    }
  };

  return (
    <div className="w-full flex items-center bg-white p-5 mt-5 mb-5 max-[390px]:flex-col">
      <img className="w-16 rounded-full p-2" src={ProfileImg} alt="profile" />
      <form
        className="w-full flex grow h-20 max-[390px]:flex-col max-[390px]:h-32"
        onSubmit={onSubmitHandler}
      >
        <textarea
          className="grow border-2 rounded-md p-1"
          onChange={onChangeHandler}
          value={postData.content}
        />
        <SmallButton>Submit</SmallButton>
      </form>
    </div>
  );
}

export default CreatePost;
