import React, { useEffect, useState } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../Spinner";
import LikePhoto from "../assets/png/like.png";
import ReplyPhoto from "../assets/png/reply.png";

function MainPosts() {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const q = query(collection(db, "posts"));
      const getPosts = async () => {
        const querySnapshot = await getDocs(q);
        const postsArray = [];
        querySnapshot.forEach((doc) => {
          return postsArray.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setPosts(postsArray);
        setLoading(false);
      };
      getPosts();
    } catch (error) {
      toast.error("Could not fetch data.");
    }
  }, []);

  return (
    <div className="bg-gray-100 w-fit px-4" style={{ width: "107%" }}>
      <h3>Main Posts</h3>
      {loading ? (
        <Spinner />
      ) : posts && posts.length > 0 ? (
        <>
          <main>
            <ul>
              {posts.map((post) => (
                <li
                  key={post.id}
                  className="flex flex-col p-4 mb-4 bg-white rounded-lg"
                >
                  <div className="flex items-center border-b-2">
                    <div
                      className="w-10 h-10 rounded-full p-2 m-1 border-2 bg-center bg-cover bg-no-repeat"
                      style={{ backgroundImage: `url(${post.data.imgUrl})` }}
                    ></div>
                    <span>{post.data.name}</span>
                  </div>
                  <p className="p-1">{post.data.content}</p>
                  <div className="flex items-center justify-between border-t-2 p-1">
                    <button className="flex items-center transition-all hover:text-orange-600">
                      <img
                        className="w-4 h-4 mr-1"
                        src={LikePhoto}
                        alt="like"
                      />
                      <span>likes</span>
                    </button>
                    <button className="flex items-center transition-all hover:text-orange-600">
                      <img
                        className="w-4 h-4 mr-1"
                        src={ReplyPhoto}
                        alt="reply"
                      />
                      <span>reply</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </main>
        </>
      ) : (
        <p>No posts.</p>
      )}
    </div>
  );
}

export default MainPosts;
