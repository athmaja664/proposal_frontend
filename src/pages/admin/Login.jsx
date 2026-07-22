import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminLoginAPI } from "../../../services/allAPI";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaUser, FaLock, FaFacebookF, FaInstagram, FaXTwitter, FaLinkedinIn, FaPinterestP } from "react-icons/fa6";
import toast, { Toaster } from 'react-hot-toast'


function Login() {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async () => {
    ///const { email, password } = adminData;
    if (!adminData.email || !adminData.password) {
      toast.error("Please fill the Form");
      return;
    }
    setLoading(true)
    try {
      const response = await adminLoginAPI(adminData);
      console.log('response', response);
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("admin", JSON.stringify(response.data.user));
        // toast.success('Welcome Admin')
        setTimeout(() => {
          // toast.success('Welcome Admin')
          navigate("/dashboard")
        }, 1000)
      } else {
        toast.error(response.data.message || 'Invalid email or password')
        setLoading(false)
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
      setLoading(false)
    }
  };

  return (
    <div
      className="min-h-screen font-['DM_Sans',sans-serif]"
      style={{ background: "url('/Images/background_img.svg') #f9fafc center / cover no-repeat fixed" }}
    >
      <Toaster position="top-center" />

      <div className="flex flex-col items-center gap-[104px] w-full max-w-[1920px] min-h-screen mx-auto px-[164px] pt-[26px] pb-[167px] max-[1639px]:px-12 max-[1639px]:gap-[72px] max-[1200px]:px-10 max-[1200px]:pb-16 max-[640px]:px-5 max-[640px]:pb-12 max-[640px]:gap-12 max-[400px]:px-4 max-[400px]:gap-10">

        {/* navbar */}

        <header className="flex items-center justify-between w-full shrink-0 max-[640px]:flex-col max-[640px]:gap-5">

          {/* Logo */}
          <a href="#" aria-label="ProposalHub home">
            <img
              src="/icons/logo.svg"
              alt="ProposalHub"
              className="h-11 w-auto max-[400px]:h-9"
            />
          </a>

          {/* Social Icons */}
          <nav className="flex items-center gap-4 max-[400px]:gap-3" aria-label="Social media links">
            <a href="https://www.facebook.com/mindbeesteam/" aria-label="Facebook">
              <img src="/icons/facebook.svg" alt="Facebook" className="w-5 h-5 hover:opacity-70" />
            </a>

            <a href="https://www.instagram.com/mindbeesdigital" aria-label="Instagram">
              <img src="/icons/instagram.svg" alt="Instagram" className="w-5 h-5 hover:opacity-70" />
            </a>

            <a href="https://x.com/MindbeesDigital" aria-label="Twitter">
              <img src="/icons/twitter.svg" alt="Twitter" className="w-5 h-5 hover:opacity-70" />
            </a>

            <a href="https://www.linkedin.com/company/mindbees" aria-label="LinkedIn">
              <img src="/icons/linkedin.svg" alt="LinkedIn" className="w-5 h-5 hover:opacity-70" />
            </a>

            <a href="https://in.pinterest.com/mindbeesdigital/" aria-label="Pinterest">
              <img src="/icons/pinterest.svg" alt="Pinterest" className="w-5 h-5 hover:opacity-70" />
            </a>
          </nav>

        </header>

        <main className="flex justify-center w-full">
          <div className="flex justify-between items-stretch w-[1286px] max-w-full h-[599px] mx-auto max-[1200px]:flex-col-reverse max-[1200px]:items-center max-[1200px]:h-auto max-[1200px]:gap-12 max-[640px]:gap-8">

            {/* hero */}
            <section
              className="flex flex-col flex-[0_0_496px] max-w-[456px] max-w-full h-full min-h-0 max-[1200px]:hidden"
              aria-labelledby="hero-title"
            >
              <h1
                id="hero-title"
                className="mb-[26px] text-[46px] font-bold tracking-[-1.38px] leading-normal text-black"
              >
                Proposal the header theose time
              </h1>
              <p className="w-[456px] max-w-full mb-[26px] text-base font-normal leading-normal text-[#626367] capitalize">
                Welcome to the Proposal Submission & Evaluation System
              </p>
              <p className="w-[456px] max-w-full mb-0 text-base font-normal leading-normal text-[#626367] capitalize">
                A one-stop platform to submit, track and manage your project proposals efficiently
              </p>
              <figure className="flex flex-1 items-end min-h-0 mt-8 w-full">
                <img
                  src="/Images/login_image.svg"
                  alt="Illustration of a person reviewing proposals on a computer screen"
                  className="w-full max-h-full h-auto object-contain object-bottom"
                />
              </figure>
            </section>

            {/* form */}
            <section
              className="flex flex-col items-start self-center flex-[0_0_585px] w-[585px] max-w-full h-[589px] px-[46px] pt-[65px] pb-[87px] bg-white rounded-[14px] shadow-[0_8px_40px_rgba(9,8,20,0.06)] max-[1200px]:flex-none max-[1200px]:w-full max-[1200px]:max-w-[585px] max-[1200px]:h-auto max-[640px]:px-7 max-[640px]:py-12 max-[400px]:px-5 max-[400px]:py-9"
              aria-labelledby="login-title"
            >
              <h2
                id="login-title"
                className="self-stretch mb-9 text-[26px] font-semibold leading-normal text-[#1e1e21] text-center after:content-[''] after:block after:w-16 after:h-[3px] after:mt-[10px] after:mx-auto after:bg-[#576aff] after:rounded-[2px] max-[400px]:text-2xl max-[400px]:mb-7"
              >
                Login
              </h2>

              <div className="flex flex-col items-start self-stretch w-full gap-[10px]">
                <label className="block text-lg font-medium leading-normal text-[#555665] max-[400px]:text-base" htmlFor="email">
                  Username/Email
                </label>
                <div className="flex items-center gap-[10px] h-[54px] px-[10px] w-full bg-white border border-[#c3c5d0] rounded-[4px] transition-colors focus-within:border-[#576aff]">
                  <span className="flex-none w-6 h-6 text-[#818293]" aria-hidden="true">
                    <img src="/icons/profile.svg" alt="Facebook" className="w-7 h-7 hover:opacity-70" />
                  </span>
                  <input
                    className="flex-1 w-full min-w-0 h-full text-base font-normal text-[#1e1e21] bg-transparent border-none outline-none placeholder:font-medium placeholder:text-[#818293]"
                    type="text"
                    id="email"
                    name="email"
                    placeholder="Enter username or email"
                    autoComplete="username"
                    value={adminData.email}
                    onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex flex-col items-start self-stretch w-full gap-[10px] mt-[34px]">
                <label className="block text-lg font-medium leading-normal text-[#555665] max-[400px]:text-base" htmlFor="password">
                  Password
                </label>
                <div className="flex items-center gap-[10px] h-[54px] px-[10px] w-full bg-white border border-[#c3c5d0] rounded-[4px] transition-colors focus-within:border-[#576aff]">
                  <span className="flex-none w-6 h-6 text-[#818293]" aria-hidden="true">
                    <img src="/icons/lock.svg" alt="Facebook" className="w-7 h-7 hover:opacity-70" />
                  </span>
                  <input
                    className="flex-1 w-full min-w-0 h-full text-base font-normal text-[#1e1e21] bg-transparent border-none outline-none placeholder:font-medium placeholder:text-[#818293]"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Enter Password"
                    autoComplete="current-password"
                    value={adminData.password}
                    onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                  />
                  <span
                    className="text-[#818293] ml-2 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between self-stretch w-full mt-[42px] max-[640px]:flex-col max-[640px]:items-start max-[640px]:gap-3">
               
                <Link
                  to="/forgot-password"
                  className="text-base font-medium text-[#576aff] no-underline hover:opacity-85"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                className="flex items-center justify-center self-stretch w-full max-w-[493px] h-[62px] mt-[33px] p-[10px] text-lg font-bold text-white bg-[#576aff] border-none rounded-[3px] cursor-pointer transition-colors hover:bg-[#3d52f2] active:scale-[0.995] disabled:opacity-70 disabled:cursor-not-allowed max-[400px]:h-[54px] max-[400px]:text-base"
              >
                {loading ? 'Connecting...' : 'Login'}
              </button>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}

export default Login;