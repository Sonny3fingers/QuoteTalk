import { useState } from "react";
import Navbar from "../components/Navbar";
import CreatePost from "../components/layout/CreatePost";
import MainPostList from "../components/layout/MainPostList";

function Home() {
  const [createdPost, setCreatedPost] = useState(null);

  const createdPostHandler = (post) => {
    setTimeout(() => {
      setCreatedPost(post);
    }, [2000]);
  };
  return (
    <>
      <Navbar />
      <CreatePost createdPostHandler={createdPostHandler} />
      <MainPostList createdPost={createdPost} />
    </>
  );
}

export default Home;
