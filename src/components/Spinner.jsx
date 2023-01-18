import React from "react";
import SpinnerLoader from "./assets/spinner.gif";

const Spinner = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <img className="w-1/3" src={SpinnerLoader} alt="spinner loader" />
    </div>
  );
};

export default Spinner;
