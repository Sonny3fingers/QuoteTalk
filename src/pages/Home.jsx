import Navbar from "../components/Navbar";
import CreatePost from "../components/layout/CreatePost";
import MainPostList from "../components/layout/MainPostList";

function Home() {
  return (
    <>
      <Navbar />
      <CreatePost />
      <MainPostList />
    </>
  );
}

export default Home;
