import React, { useEffect, useState } from "react";
import ProfileImg from "../assets/png/profile.png";
import SmallButton from "../SmallButton";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../Spinner";

function CreateComment({ postId, onCloseCommentForm, onCreateCommentHandler }) {
  const auth = getAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [comment, setComment] = useState({
    content: "",
    likes: 0,
    likedByUserIds: [],
    userId: "",
    postId: postId,
    imgUrl: "",
    name: "",
  });

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setComment((prevState) => ({
          ...prevState,
          userId: user.uid,
          imgUrl: user.photoURL,
          name: user.displayName,
        }));
      }
    });
  }, [auth]);

  const onChangeHandler = (e) => {
    setComment((prevState) => ({
      ...prevState,
      content: e.target.value,
      likes: 0,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (comment.content.trim() !== "") {
      setIsLoading(true);

      const formData = { ...comment, timestamp: serverTimestamp() };

      try {
        await addDoc(collection(db, "comments"), formData);

        toast.success("Comment created.");
        setIsLoading(false);
        setComment((prevState) => ({
          ...prevState,
          content: "",
        }));
        onCloseCommentForm();
        onCreateCommentHandler(comment);
      } catch (error) {
        toast.error("Could not create a comment");
        setIsLoading(false);
        setComment((prevState) => ({
          ...prevState,
          content: "",
        }));
      }
    } else {
      toast.error("Can not submit empty comment.");
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="w-full flex items-center bg-white p-5 mb-2 rounded-lg max-[390px]:flex-col animate-fadeIn">
      <div
        className="w-16 h-16 rounded-full p-2 m-2 border-2 bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${comment.imgUrl || ProfileImg})` }}
      ></div>
      <form
        className="w-full flex grow h-20 max-[390px]:flex-col max-[390px]:h-32"
        onSubmit={onSubmitHandler}
      >
        <textarea
          className="grow border-2 rounded-md p-1"
          onChange={onChangeHandler}
          value={comment.content}
        />
        <SmallButton>Submit</SmallButton>
      </form>
    </div>
  );
}

export default CreateComment;
