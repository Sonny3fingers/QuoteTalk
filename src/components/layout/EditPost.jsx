import React, { useEffect, useState } from "react";
import ProfileImg from "../assets/png/profile.png";
import SmallButton from "../SmallButton";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../Spinner";

function EditPost({ post, editHandler }) {
  const auth = getAuth();

  const [loading, setLoading] = useState(false);

  const [postData, setPostData] = useState({
    content: post.data.content,
    likes: post.data.likes,
    userId: post.id,
    imgUrl: post.data.imgUrl,
    name: post.data.name,
  });

  const onChangeHandler = (e) => {
    setPostData((prevState) => ({
      ...prevState,
      content: e.target.value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const formData = {
      ...postData,
      timestamp: serverTimestamp(),
    };
    setLoading(true);
    try {
      await updateDoc(doc(db, "posts", post.id), {
        content: formData.content,
      });

      toast.success("Created post.");
      setLoading(false);
    } catch (error) {
      toast.error("Could not create post data.");
      setLoading(false);
    }
    editHandler(postData.content);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="w-full flex items-center bg-white p-5 mt-5 mb-5 rounded-lg max-[390px]:flex-col transition-all duration-500 easy-out animate-fadeIn">
      <div
        className="w-16 h-16 rounded-full p-2 m-2 border-2 bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${postData.imgUrl || ProfileImg})` }}
      ></div>
      <form
        className="w-full flex grow h-20 max-[390px]:flex-col max-[390px]:h-32"
        onSubmit={onSubmitHandler}
      >
        <textarea
          className="grow border-2 rounded-md p-1"
          type="text"
          onChange={onChangeHandler}
          value={postData.content}
          autoFocus
        />
        <SmallButton>Submit</SmallButton>
      </form>
    </div>
  );
}

export default EditPost;
