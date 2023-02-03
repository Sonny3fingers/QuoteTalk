import React, { useEffect, useState } from "react";
import ProfileImg from "../assets/png/profile.png";
import SmallButton from "../SmallButton";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../Spinner";

function CreatePost({ createdPostHandler }) {
  const auth = getAuth();

  const [loading, setLoading] = useState(false);
  const [postData, setPostData] = useState({
    content: "",
    likes: 0,
    likedByUserIds: [],
    userId: "",
    imgUrl: "",
    name: "",
  });

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setPostData((prevState) => ({
          ...prevState,
          userId: user.uid,
          imgUrl: user.photoURL,
          name: user.displayName,
        }));
      }
    });
  }, [auth]);

  const onChangeHandler = (e) => {
    setPostData((prevState) => ({
      ...prevState,
      content: e.target.value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (postData.content.trim() !== "") {
      const formData = {
        ...postData,
        timestamp: serverTimestamp(),
      };
      setLoading(true);
      try {
        await addDoc(collection(db, "posts"), formData);

        toast.success("Created post.");
        setLoading(false);
        setPostData((prevState) => ({
          ...prevState,
          content: "",
        }));
        createdPostHandler(postData);
      } catch (error) {
        toast.error("Could not create post data.");
        setLoading(false);
        setPostData((prevState) => ({
          ...prevState,
          content: "",
        }));
      }
    } else {
      toast.error("Can not submit empty post.");
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="w-full flex items-center bg-white p-5 mt-5 mb-5 rounded-lg max-[420px]:flex-col">
      <div
        className="w-16 h-16 rounded-full p-2 m-2 border-2 bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${postData.imgUrl || ProfileImg})` }}
      ></div>
      <form
        className="w-full flex grow h-20 max-[420px]:flex-col max-[420px]:h-32"
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
