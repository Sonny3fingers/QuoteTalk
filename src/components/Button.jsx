import React from "react";

function Button({ children }) {
  return (
    <button className="bg-teal-500 px-4 py-1 border-0 rounded-full text-xl text-white transition-all hover:bg-teal-600">
      {children}
    </button>
  );
}

export default Button;
