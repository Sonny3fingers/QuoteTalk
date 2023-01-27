import React, { useEffect, useState } from "react";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../Spinner";
import PostItem from "./PostItem";

function MainPostList({ createdPost }) {
  const [posts, setPosts] = useState(null);
  const [comments, setComments] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const q = query(collection(db, "posts"));
      const q2 = query(collection(db, "comments"));
      const getPosts = async () => {
        const querySnapshot = await getDocs(q);
        const querySnapshot2 = await getDocs(q2);
        const postsArray = [];
        const commentsArray = [];
        querySnapshot.forEach((doc) => {
          return postsArray.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        querySnapshot2.forEach((doc) => {
          return commentsArray.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setPosts(postsArray);
        setComments(commentsArray);
        setLoading(false);
      };
      getPosts();
    } catch (error) {
      toast.error("Could not fetch data.");
    }
  }, [createdPost]);

  const onDeletePost = (updatedPosts) => {
    setPosts(updatedPosts);
  };

  const onDeleteComment = (updatedComments) => {
    setComments(updatedComments);
  };

  return (
    <div className="bg-gray-100 w-fit px-4" style={{ width: "107%" }}>
      <h3>Main Post List</h3>
      {loading ? (
        <Spinner />
      ) : posts && posts.length > 0 ? (
        <>
          <main>
            <ul>
              {posts.map((post) => (
                <PostItem
                  key={post.id}
                  post={post}
                  comments={comments}
                  posts={posts}
                  onDeletePost={onDeletePost}
                  onDeleteComment={onDeleteComment}
                />
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

export default MainPostList;
