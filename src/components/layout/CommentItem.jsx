import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase.config";
import { toast } from "react-toastify";
import blancProfilePhoto from "../assets/png/profile.png";
import EditIcon from "../assets/png/edit.png";
import DeleteIcon from "../assets/png/delete.png";
import LikeIcon from "../assets/png/like.png";
import ReplyIcon from "../assets/png/reply.png";
import EditComment from "./EditComment";
import CreateComment from "./CreateComment";
import ConfirmModal from "./ConfirmModal";

function CommentItem({
  comment,
  comments,
  onDeleteComment,
  onCreateCommentHandler,
}) {
  const auth = getAuth();

  const [showEditComment, setShowEditComment] = useState(false);
  const [showCreateComment, setShowCreateComment] = useState(false);
  const [updatedComment, setUpdatedComment] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteCommentItem, setDeleteCommentItem] = useState(false);

  const deleteHandler = async (commentId) => {
    setShowConfirmModal(true);
    if (deleteCommentItem) {
      try {
        await deleteDoc(doc(db, "comments", comment.id));
        const updatedComments = comments.filter(
          (comment) => comment.id !== commentId
        );
        onDeleteComment(updatedComments);
        toast.success("Comment deleted.");
      } catch (error) {
        toast.error("Could not delete post.");
      }
    }
  };

  const onShowConfirmHandler = () => {
    setShowConfirmModal(false);
  };

  const onConfirmDeleteHandler = () => {
    setDeleteCommentItem(true);
  };

  const editCommentHandler = (updatedContent) => {
    setShowEditComment((prevState) => !prevState);
    setUpdatedComment(updatedContent);
  };

  const replyClickHandler = () => {
    setShowCreateComment((prevState) => !prevState);
  };

  const onCloseCommentForm = () => {
    setShowCreateComment(false);
  };

  return (
    <>
      <li className="w-11/12 flex flex-col bg-white rounded-lg self-end p-2 mb-2 animate-fadeIn">
        <div className="flex items-center">
          <div
            className="w-9 h-9 rounded-full p-1 m-1 border-2 bg-center bg-cover bg-no-repeat"
            style={{
              backgroundImage:
                comment.data.imgUrl === ""
                  ? `url(${blancProfilePhoto})`
                  : `url(${comment.data.imgUrl})`,
            }}
          ></div>
          <span>{comment.data.name}</span>
        </div>
        <p className="p-1">
          {updatedComment ? updatedComment : comment.data.content}
        </p>
        <div className="flex items-center justify-between border-t-2 p-1">
          <button className="flex items-center font-bold transition-all hover:text-teal-600">
            <img className="w-4 h-4 mr-1" src={LikeIcon} alt="like" />
            <span>likes</span>
          </button>
          {auth.currentUser.uid === comment.data.userId ? (
            <div className="flex ">
              <button
                className="flex items-center mr-2 transition-all hover:text-rose-600"
                onClick={() => {
                  deleteHandler(comment.id);
                }}
              >
                <img className="w-4 h-4 mr-1" src={DeleteIcon} alt="reply" />
                <span>delete</span>
              </button>
              <button
                className="flex items-center transition-all hover:text-blue-600"
                onClick={() => {
                  editCommentHandler();
                }}
              >
                <img className="w-4 h-4 mr-1" src={EditIcon} alt="reply" />
                <span>{showEditComment ? "cancel" : "edit"}</span>
              </button>
            </div>
          ) : (
            <button
              className="flex items-center transition-all hover:text-orange-600"
              onClick={replyClickHandler}
            >
              <img className="w-4 h-4 mr-1" src={ReplyIcon} alt="reply" />
              <span>{showCreateComment ? "cancel" : "reply"}</span>
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
      {showCreateComment && (
        <CreateComment
          postId={comment.data.postId}
          onCloseCommentForm={onCloseCommentForm}
          onCreateCommentHandler={onCreateCommentHandler}
        />
      )}
      {showEditComment && (
        <EditComment
          commentData={comment}
          editCommentHandler={editCommentHandler}
          updatedComment={updatedComment}
        />
      )}
    </>
  );
}

export default CommentItem;
