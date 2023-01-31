import React from "react";

function ConfirmModal({ onShowConfirmHandler, onConfirmDeleteHandler }) {
  const onCancelHandler = () => {
    onShowConfirmHandler();
  };

  const confirmDeleteHandler = () => {
    console.log("Hello");
    onShowConfirmHandler();
    onConfirmDeleteHandler();
  };

  return (
    <div className="fixed bottom-0 left-0 w-full h-full flex justify-center items-center backdrop-blur-lg backdrop-opacity-90 transition animate-fadeInFaster">
      <div className="bg-white p-6 m-2 border-4 rounded-lg">
        <p className="text-2xl mb-12 text-center">
          Are you sure you want to delete?
        </p>
        <div className="flex justify-around items-center">
          <button
            className="bg-red-400 px-4 py-1 border-0 rounded-full text-xl text-white transition-all easy-out duration-500 hover:bg-red-600"
            onClick={confirmDeleteHandler}
          >
            Delete
          </button>
          <button
            className="bg-white px-4 py-1 border-2 border-teal-400 rounded-full text-xl transition-all easy-out duration-500 hover:bg-teal-400"
            onClick={onCancelHandler}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
