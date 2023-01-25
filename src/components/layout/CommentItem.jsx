import React from "react";
import { getAuth } from "firebase/auth";
import blancProfilePhoto from "../assets/png/profile.png";
import EditIcon from "../assets/png/edit.png";
import DeleteIcon from "../assets/png/delete.png";
import LikeIcon from "../assets/png/like.png";
import ReplyIcon from "../assets/png/reply.png";

function CommentItem({ comment }) {
  const auth = getAuth();

  return (
    <li className="w-11/12 flex flex-col bg-white rounded-lg self-end p-2 mb-4">
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
      <p className="p-1">{comment.data.content}</p>
      <div className="flex items-center justify-between border-t-2 p-1">
        <button className="flex items-center font-bold transition-all hover:text-teal-600">
          <img className="w-4 h-4 mr-1" src={LikeIcon} alt="like" />
          <span>likes</span>
        </button>
        {auth.currentUser.uid === comment.data.userId ? (
          <div className="flex ">
            <button className="flex items-center mr-2 transition-all hover:text-rose-600">
              <img className="w-4 h-4 mr-1" src={DeleteIcon} alt="reply" />
              <span>delete</span>
            </button>
            <button className="flex items-center transition-all hover:text-blue-600">
              <img className="w-4 h-4 mr-1" src={EditIcon} alt="reply" />
              <span>edit</span>
            </button>
          </div>
        ) : (
          <button className="flex items-center transition-all hover:text-orange-600">
            <img className="w-4 h-4 mr-1" src={ReplyIcon} alt="reply" />
            <span>reply</span>
          </button>
        )}
      </div>
    </li>
  );
}

export default CommentItem;
