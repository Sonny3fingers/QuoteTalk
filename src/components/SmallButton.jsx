import React from "react";

function Button({ children }) {
  return (
    <button className="bg-teal-500 p-1 ml-2 mt-2 border-0 rounded-lg text-normal text-white transition-all self-end hover:bg-teal-600">
      {children}
    </button>
  );
}

export default Button;
