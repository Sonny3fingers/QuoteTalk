import React, { useState, useEffect, useRef } from "react";
import { getAuth } from "firebase/auth";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase.config";
import { toast } from "react-toastify";
import LikeIcon from "../assets/png/like.png";
import ReplyIcon from "../assets/png/reply.png";
import EditIcon from "../assets/png/edit.png";
import DeleteIcon from "../assets/png/delete.png";
import CommentItem from "./CommentItem";
import CreateComment from "./CreateComment";
import EditPost from "./EditPost";
import ConfirmModal from "./ConfirmModal";

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
  const [showEditPostForm, setShowEditPostForm] = useState(false);
  const [editContentValue, setEditContentValue] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deletePostItem, setDeletePostItem] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCounter, setLikeCounter] = useState(post.data.likes);
  const [likedByUserIds, setLikedByUserIds] = useState(
    post.data.likedByUserIds
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [isShowingExpandButton, setIsShowingExpandButton] = useState(false);
  const paragraphRef = useRef(null);

  const auth = getAuth();

  useEffect(() => {
    if (likedByUserIds.includes(auth.currentUser.uid)) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  }, [likedByUserIds, auth]);

  const onShowConfirmHandler = () => {
    setShowConfirmModal((prevState) => !prevState);
  };

  const onConfirmDeleteHandler = () => {
    setDeletePostItem(true);
  };

  const replyClickHandler = () => {
    setShowCommentForm((prevState) => !prevState);
  };

  const onCloseCommentForm = () => {
    setShowCommentForm(false);
  };

  useEffect(() => {
    if (deletePostItem) {
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
      deleteHandler(post.id);
    }
  }, [deletePostItem, post.id, onDeletePost, posts]);

  const editHandler = (editContent) => {
    setShowEditPostForm((prevState) => !prevState);
    setEditContentValue(editContent);
  };

  const addLikeHandler = (userId) => {
    setLikeCounter((prevState) => prevState + 1);
    setLikedByUserIds([...likedByUserIds, userId]);
  };

  useEffect(() => {
    const updateLikes = async (postId) => {
      if (isLiked) {
        try {
          await updateDoc(doc(db, "posts", postId), {
            likes: likeCounter,
            likedByUserIds: likedByUserIds,
          });
        } catch (error) {
          toast.error("Could not add like.");
        }
      }
    };
    updateLikes(post.id);
  }, [isLiked, likeCounter, post.id, likedByUserIds]);

  const showMoreTextHandler = () => {
    setIsExpanded((prevState) => !prevState);
  };

  useEffect(() => {
    if (paragraphRef.current.offsetHeight > 80) {
      setIsShowingExpandButton(true);
    }
  }, []);

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
        <p
          ref={paragraphRef}
          className={
            !isShowingExpandButton
              ? "p-1 line-clamp-none"
              : isExpanded
              ? "p-1 line-clamp-none"
              : "p-1 line-clamp-3"
          }
        >
          {editContentValue ?? post.data.content}
        </p>
        {isShowingExpandButton && (
          <span
            className="self-end cursor-pointer transition-all hover:text-blue-400"
            onClick={showMoreTextHandler}
          >
            {isExpanded ? "see less" : "see more"}
          </span>
        )}
        {(isLiked || post.data.likes !== 0) && (
          <span className="text-xs transition-all animate-fadeIn">
            {`${likeCounter} person likes`}
          </span>
        )}
        <div className="flex items-center justify-between border-t-2 p-1">
          <button
            className="flex items-center font-bold transition-all hover:text-blue-600"
            onClick={() => {
              addLikeHandler(auth.currentUser.uid);
            }}
            disabled={isLiked ? true : false}
          >
            <img className="w-4 h-4 mr-1" src={LikeIcon} alt="like" />
            <span className={isLiked ? "text-blue-600" : ""}>
              {isLiked ? "liked" : "like"}
            </span>
          </button>
          {auth.currentUser.uid === post.data.userId ? (
            <div className="flex ">
              <button
                className="flex items-center mr-2 transition-all hover:text-rose-600"
                onClick={() => {
                  onShowConfirmHandler();
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
                <span>{!showEditPostForm ? "edit" : "cancel"}</span>
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
      {showConfirmModal && (
        <ConfirmModal
          onShowConfirmHandler={onShowConfirmHandler}
          onConfirmDeleteHandler={onConfirmDeleteHandler}
        />
      )}
      {showCommentForm && (
        <CreateComment
          postId={post.id}
          onCloseCommentForm={onCloseCommentForm}
          onCreateCommentHandler={onCreateCommentHandler}
        />
      )}
      {showEditPostForm && <EditPost post={post} editHandler={editHandler} />}

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
