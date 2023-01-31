import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase.config";
import { toast } from "react-toastify";
import LikeIcon from "../assets/png/like.png";
import ReplyIcon from "../assets/png/reply.png";
import EditIcon from "../assets/png/edit.png";
import DeleteIcon from "../assets/png/delete.png";
import CommentItem from "./CommentItem";
import CreateComment from "./CreateComment";
import EditPost from "./EditPost";

function PostItem({
  post,
  comments,
  posts,
  onDeletePost,
  onDeleteComment,
  onCreateCommentHandler,
  createdPost,
}) {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [editPostForm, setEditPostForm] = useState(false);
  const [editContentValue, setEditContentValue] = useState(null);

  const auth = getAuth();

  const replyClickHandler = () => {
    setShowCommentForm((prevState) => !prevState);
  };

  const onCloseCommentForm = () => {
    setShowCommentForm(false);
  };

  const deleteHandler = async (postId) => {
    try {
      await deleteDoc(doc(db, "posts", postId));
      const updatePosts = posts.filter((post) => post.id !== postId);
      onDeletePost(updatePosts);
      toast.success("Post deleted.");
    } catch (error) {
      toast.error("Could not delete post.");
    }
  };

  const editHandler = (editContent) => {
    setEditPostForm((prevState) => !prevState);
    setEditContentValue(editContent);
  };

  return (
    <>
      <li
        className="flex flex-col p-4 mb-2 bg-white rounded-lg animate-fadeIn"
        style={{ animationIterationCount: 1 }}
      >
        <div className="flex items-center border-b-2">
          <div
            className="w-10 h-10 rounded-full p-2 m-1 border-2 bg-center bg-cover bg-no-repeat"
            style={{ backgroundImage: `url(${post.data.imgUrl})` }}
          ></div>
          <span>{post.data.name}</span>
        </div>
        <p className="p-1">{editContentValue ?? post.data.content}</p>
        <div className="flex items-center justify-between border-t-2 p-1">
          <button className="flex items-center font-bold transition-all hover:text-teal-500">
            <img className="w-4 h-4 mr-1" src={LikeIcon} alt="like" />
            <span>likes</span>
          </button>
          {auth.currentUser.uid === post.data.userId ? (
            <div className="flex ">
              <button
                className="flex items-center mr-2 transition-all hover:text-rose-600"
                onClick={() => {
                  deleteHandler(post.id);
                }}
              >
                <img className="w-4 h-4 mr-1" src={DeleteIcon} alt="reply" />
                <span>delete</span>
              </button>
              <button
                className="flex items-center transition-all hover:text-blue-600"
                onClick={() => {
                  editHandler();
                }}
              >
                <img className="w-4 h-4 mr-1" src={EditIcon} alt="reply" />
                <span>{!editPostForm ? "edit" : "cancel"}</span>
              </button>
            </div>
          ) : (
            <button
              className="flex items-center transition-all hover:text-orange-600"
              onClick={replyClickHandler}
            >
              <img className="w-4 h-4 mr-1" src={ReplyIcon} alt="reply" />
              <span>{showCommentForm ? "cancel" : "reply"}</span>
            </button>
          )}
        </div>
      </li>
      {showCommentForm && (
        <CreateComment
          postId={post.id}
          onCloseCommentForm={onCloseCommentForm}
          onCreateCommentHandler={onCreateCommentHandler}
        />
      )}
      {editPostForm && <EditPost post={post} editHandler={editHandler} />}

      <ul className="w-full flex flex-col">
        {comments.map((comment) =>
          comment.data.postId === post.id ? (
            <CommentItem
              key={comment.id}
              comment={comment}
              comments={comments}
              onDeleteComment={onDeleteComment}
              onCreateCommentHandler={onCreateCommentHandler}
            >
              {comment.data.content}
            </CommentItem>
          ) : (
            ""
          )
        )}
      </ul>
    </>
  );
}

export default PostItem;
