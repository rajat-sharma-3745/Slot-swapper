import React from "react";

const Spinner = () => {
  return (
    <div className="flex justify-center items-center w-screen h-[calc(100vh-4rem)]" >
      <div
        className={`border-4 w-16 h-16 border-t-transparent border-solid rounded-full border-blue-400 animate-spin`}
      ></div>
    </div>
  );
};

export default Spinner;
