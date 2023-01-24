import Navbar from "../components/Navbar";
import CreatePost from "../components/layout/CreatePost";
import MainPosts from "../components/layout/MainPosts";

function Home() {
  return (
    <>
      <Navbar />
      <CreatePost />
      <MainPosts />
    </>
  );
}

export default Home;
