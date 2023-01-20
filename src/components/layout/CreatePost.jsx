import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileImg from "../assets/png/profile.png";
import SmallButton from "../SmallButton";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../Spinner";

function CreatePost() {
  const [loading, setLoading] = useState(false);
  const [postData, setPostData] = useState({
    content: "",
    likes: 0,
    userId: "",
  });

  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setPostData((prevState) => ({ ...prevState, userId: user.uid }));
      }
    });
  }, [auth]);

  const onChangeHandler = (e) => {
    setPostData((prevState) => ({
      ...prevState,
      content: e.target.value,
      likes: 0,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "posts"), postData);

      toast.success("Created post.");
      setLoading(false);
      setPostData({});
    } catch (error) {
      toast.error("Could not send post data.");
      setLoading(false);
      setPostData({});
    }
  };

  if (loading) {
    return <Spinner />;
  }

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
