import React from "react";
import SpinnerLoader from "./assets/spinnerLoader.svg";

const Spinner = () => {
  return (
    <div className="w-full h-full flex justify-center items-center transition animate-spin">
      <img className="w-1/6" src={SpinnerLoader} alt="spinner loader" />
    </div>
  );
};

export default Spinner;
