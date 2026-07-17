import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "url('/Images/background_img.svg') #f9fafc center / cover no-repeat fixed" }}
    >
      <div className="flex flex-col items-center text-center  rounded-[16px] px-10 py-14 max-w-md w-full">
        <h1 className="text-8xl font-bold text-[#576aff]">404</h1>

        <h2 className="text-2xl font-semibold text-[#3f4050] mt-4">
          Page Not Found
        </h2>

        <p className="text-[#818293] text-sm mt-2">
          The page you are looking for does not exist.
        </p>

        <Link
          to="/dashboard"
          className="mt-8 inline-flex items-center justify-center w-full px-5 py-3 text-sm font-medium text-white bg-[#576aff] rounded-[8px] no-underline hover:bg-[#3d52f2] transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default NotFound;