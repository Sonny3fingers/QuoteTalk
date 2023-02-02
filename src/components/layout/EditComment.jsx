import React, { useState } from "react";
import ProfileImg from "../assets/png/profile.png";
import SmallButton from "../SmallButton";
import { serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../Spinner";

function EditComment({ commentData, editCommentHandler }) {
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState({
    content: commentData.data.content,
    likes: commentData.data.likes,
    likedByUserIds: commentData.data.likedByUserIds,
    userId: commentData.data.userId,
    postId: commentData.data.postId,
    imgUrl: commentData.data.imgUrl,
    name: commentData.data.name,
  });

  const onChangeHandler = (e) => {
    setComment((prevState) => ({
      ...prevState,
      content: e.target.value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = { ...comment, timestamp: serverTimestamp() };

    try {
      await updateDoc(doc(db, "comments", commentData.id), {
        content: formData.content,
      });

      toast.success("Comment updated.");
      setLoading(false);
      editCommentHandler(formData.content);
    } catch (error) {
      toast.error("Could not update a comment");
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="w-full flex items-center bg-white p-5 mt-2 mb-2 rounded-lg max-[390px]:flex-col transition duration-500 easy-in animate-fadeIn">
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
          autoFocus
        />
        <SmallButton>Submit</SmallButton>
      </form>
    </div>
  );
}

export default EditComment;
