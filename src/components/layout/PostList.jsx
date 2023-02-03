import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  getDocs,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../Spinner";
import PostItem from "./PostItem";

function PostList({ createdPost }) {
  const [posts, setPosts] = useState(null);
  const [comments, setComments] = useState(null);
  const [createdComment, setCreatedComment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetchedPost, setLastFetchedPost] = useState(null);

  const onCreateCommentHandler = (newComment) => {
    setTimeout(() => {
      setCreatedComment(newComment);
    }, [2000]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryPosts = query(
          collection(db, "posts"),
          orderBy("timestamp", "desc"),
          limit(5)
        );
        const queryComments = query(
          collection(db, "comments"),
          orderBy("timestamp", "asc")
          // limit(10)
        );

        const querySnapshotPosts = await getDocs(queryPosts);

        const lastVisiblePost =
          querySnapshotPosts.docs[querySnapshotPosts.docs.length - 1];

        setLastFetchedPost(lastVisiblePost);

        const querySnapshotComments = await getDocs(queryComments);
        const postsArray = [];
        const commentsArray = [];
        querySnapshotPosts.forEach((doc) => {
          return postsArray.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        querySnapshotComments.forEach((doc) => {
          return commentsArray.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setPosts(postsArray);
        setComments(commentsArray);
        setIsLoading(false);
      } catch (error) {
        toast.error("Could not fetch data.");
        setIsLoading(false);
      }
    };
    fetchData();
  }, [createdPost, createdComment]);

  // Fetch More Posts
  const onFetchMorePosts = async () => {
    try {
      const queryPosts = query(
        collection(db, "posts"),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedPost),
        limit(5)
      );
      const queryComments = query(
        collection(db, "comments"),
        orderBy("timestamp", "asc")
        // limit(10)
      );

      const querySnapshotPosts = await getDocs(queryPosts);

      const lastVisiblePost =
        querySnapshotPosts.docs[querySnapshotPosts.docs.length - 1];

      setLastFetchedPost(lastVisiblePost);

      const querySnapshotComments = await getDocs(queryComments);
      const postsArray = [];
      const commentsArray = [];
      querySnapshotPosts.forEach((doc) => {
        return postsArray.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      querySnapshotComments.forEach((doc) => {
        return commentsArray.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setPosts((prevState) => [...prevState, ...postsArray]);
      setComments(commentsArray);
      setIsLoading(false);
    } catch (error) {
      toast.error("Could not fetch data.");
    }
  };

  const onDeletePost = (updatedPosts) => {
    setPosts(updatedPosts);
  };

  const onDeleteComment = (updatedComments) => {
    setComments(updatedComments);
  };

  return (
    <div
      className="bg-gray-100 w-fit px-4 pb-6 flex flex-col"
      style={{ width: "107%" }}
    >
      <h3>Feed:</h3>
      {isLoading ? (
        <Spinner />
      ) : posts && posts.length > 0 ? (
        <>
          <main className="mb-5">
            <ul>
              {posts.map((post) => (
                <PostItem
                  key={post.id}
                  post={post}
                  comments={comments}
                  posts={posts}
                  onDeletePost={onDeletePost}
                  onDeleteComment={onDeleteComment}
                  onCreateCommentHandler={onCreateCommentHandler}
                />
              ))}
            </ul>
          </main>
          {lastFetchedPost && (
            <button
              className="w-auto bg-teal-500 p-1 ml-2 mt-2 mb-5 border-0 rounded-lg text-normal text-white transition-all hover:bg-teal-600"
              onClick={onFetchMorePosts}
            >
              Load More
            </button>
          )}
        </>
      ) : (
        <p>No posts.</p>
      )}
    </div>
  );
}

export default PostList;
