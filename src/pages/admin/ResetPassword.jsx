import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { resetPasswordAPI } from "../../../services/allAPI";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import toast, { Toaster } from "react-hot-toast";

function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleResetPassword = async () => {
    const { newPassword, confirmPassword } = passwordData;

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await resetPasswordAPI(token, {
        newPassword,
      });

      if (response.status === 200) {
        toast.success("Password reset successfully");

        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen font-['DM_Sans',sans-serif] overflow-x-hidden"
      style={{
        background: 
          "url('/Images/background_img.svg') #f9fafc center / cover no-repeat fixed",
      }}
    >
      <Toaster position="top-center" />

      <div className="flex flex-col items-center gap-12 sm:gap-16 md:gap-20 lg:gap-[104px] w-full max-w-[1920px] min-h-screen mx-auto px-4 max-[640px]:px-5 max-[1200px]:px-10 max-[1639px]:px-12 pt-[26px] pb-10 sm:pb-16 md:pb-24 lg:pb-[167px]">

        {/* Navbar */}

        <header className="flex items-center justify-between w-full flex-wrap gap-4">

          <img
            src="/icons/logo.svg"
            alt="Logo"
            className="h-9 sm:h-10 md:h-11"
          />

          <nav className="flex items-center gap-3 sm:gap-4 flex-wrap">

            <a href="https://www.facebook.com/mindbeesteam/">
              <img src="/icons/facebook.svg" className="w-5 h-5" />
            </a>

            <a href="https://www.instagram.com/mindbeesdigital">
              <img src="/icons/instagram.svg" className="w-5 h-5" />
            </a>

            <a href="https://x.com/MindbeesDigital">
              <img src="/icons/twitter.svg" className="w-5 h-5" />
            </a>

            <a href="https://www.linkedin.com/company/mindbees">
              <img src="/icons/linkedin.svg" className="w-5 h-5" />
            </a>

            <a href="https://in.pinterest.com/mindbeesdigital/">
              <img src="/icons/pinterest.svg" className="w-5 h-5" />
            </a>

          </nav>

        </header>

        <main className="flex justify-center w-full">

          <div className="flex justify-between items-center w-full max-w-[1286px] flex-col-reverse lg:flex-row gap-8 sm:gap-10 max-[1200px]:gap-12">

            {/* Left Side */}

            <section className="hidden lg:flex flex-col flex-[0_0_496px] max-w-[456px] max-[1200px]:hidden">

              <h1 className="mb-[26px] text-[46px] font-bold">
                Reset Password
              </h1>

              <p className="mb-5 text-[#626367]">
                Create a new password for your account.
              </p>

              <p className="text-[#626367]">
                Your new password should be secure and easy for you to remember.
              </p>

              <div className="flex flex-1 items-end mt-8">
                <img
                  src="/Images/login_image.svg"
                  className="w-full object-contain"
                />
              </div>

            </section>

            {/* Right Side */}

            <section className="flex flex-col self-center w-full lg:flex-[0_0_585px] lg:w-[585px] max-w-[585px] mx-auto bg-white rounded-[14px] shadow-[0_8px_40px_rgba(9,8,20,0.06)] px-5 sm:px-8 md:px-10 lg:px-[46px] py-8 sm:py-10 md:py-12 lg:py-[55px]">

              <h2 className="text-center text-xl sm:text-2xl lg:text-[26px] font-semibold mb-8 sm:mb-10 after:content-[''] after:block after:w-16 after:h-[3px] after:bg-[#576aff] after:mx-auto after:mt-3">

                Reset Password

              </h2>

              {/* New Password */}

              <label className="text-base sm:text-lg font-medium text-[#555665] mb-3">
                New Password
              </label>

              <div className="flex items-center h-[54px] border border-[#c3c5d0] rounded px-3 focus-within:border-[#576aff]">

                <img
                  src="/icons/lock.svg"
                  className="w-6 h-6 mr-3 shrink-0"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter New Password"
                  className="w-full min-w-0 outline-none"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                />

                <span
                  className="cursor-pointer shrink-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible />
                  ) : (
                    <AiOutlineEye />
                  )}
                </span>

              </div>

              {/* Confirm Password */}

              <label className="text-base sm:text-lg font-medium text-[#555665] mb-3 mt-6">
                Confirm Password
              </label>

              <div className="flex items-center h-[54px] border border-[#c3c5d0] rounded px-3 focus-within:border-[#576aff]">

                <img
                  src="/icons/lock.svg"
                  className="w-6 h-6 mr-3 shrink-0"
                />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full min-w-0 outline-none"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                />

                <span
                  className="cursor-pointer shrink-0"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  {showConfirmPassword ? (
                    <AiOutlineEyeInvisible />
                  ) : (
                    <AiOutlineEye />
                  )}
                </span>

              </div>

              <button
                onClick={handleResetPassword}
                disabled={loading}
                className="mt-8 sm:mt-10 h-[54px] sm:h-[60px] w-full bg-[#576aff] text-white rounded font-semibold hover:bg-[#4258ff]"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              <div className="text-center mt-6">

                <Link
                  to="/"
                  className="text-[#576aff] font-medium hover:underline"
                >
                  ← Back to Login
                </Link>

              </div>

            </section>

          </div>

        </main>

      </div>
    </div>
  );
}

export default ResetPassword;