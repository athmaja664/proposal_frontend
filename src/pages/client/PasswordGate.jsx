import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProposalByTokenAPI, verifyPasswordAPI } from "../../../services/allAPI";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import toast, { Toaster } from 'react-hot-toast'

function PasswordGate() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [isValidLink, setIsValidLink] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [verify, setVerify] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        checkLink();
    }, []);

    const checkLink = async () => {
        const response = await getProposalByTokenAPI(token);
        setLoading(false);
        if (response.status === 200) {
            setIsValidLink(true);
        } else {
            setError(response?.data?.message || 'Invalid link');
        }
    };

    const handleVerifyPassword = async () => {
        if (!password) {
            toast.error("Please fill the Form");
            return;
        }
        setVerify(true);
        const response = await verifyPasswordAPI({ token, password });
        if (response.status === 200) {
            if (response.data.alreadyResponded) {
                toast.success('Welcome back')
                setTimeout(() => {
                    navigate('/success', {
                        state: {
                            proposal: response.data.proposal,
                            decision: response.data.decision,
                            signature: response.data.signature
                        }
                    });
                }, 1000)
            } else {
                toast.success('Welcome')
                setTimeout(() => {
                    navigate('/proposalview', { state: { proposal: response.data.proposal } });
                }, 1000)
            }
        } else {
            toast.error(response.data.message || 'Invalid email or password')
            setVerify(false);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div
                className="min-h-screen font-['DM_Sans',sans-serif]"
                style={{ background: "url('/Images/background_img.svg') #f9fafc center / cover no-repeat fixed" }}
            >
                <Toaster position="top-center" />
                <div className="flex flex-col items-center gap-[104px] w-full max-w-[1920px] min-h-screen mx-auto px-[164px] pt-[26px] pb-[167px] max-[1639px]:px-12 max-[1639px]:gap-[72px] max-[1200px]:px-10 max-[1200px]:pb-16 max-[640px]:px-5 max-[640px]:pb-12 max-[640px]:gap-12 max-[400px]:px-4 max-[400px]:gap-10">

                    <header className="flex items-center justify-between w-full shrink-0 max-[640px]:flex-col max-[640px]:gap-5">
                        <a href="#" aria-label="ProposalHub home">
                            <img src="/icons/logo.svg" alt="ProposalHub" className="h-11 w-auto max-[400px]:h-9" />
                        </a>
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
                        <div className="flex justify-between items-center w-[1286px] max-w-full mx-auto max-[1200px]:flex-col max-[1200px]:gap-12 max-[640px]:gap-8">

                            <section className="flex flex-col flex-[0_0_585px] max-w-[585px] w-full max-[1200px]:hidden" aria-hidden="true">
                                <h1 className="mb-[26px] text-[46px] font-bold tracking-[-1.38px] leading-normal text-black">
                                    Proposal
                                </h1>
                                <p className="w-full mb-[26px] text-base font-normal leading-normal text-[#626367] capitalize">
                                    You've received a proposal for your review
                                </p>
                                <p className="w-full mb-0 text-base font-normal leading-normal text-[#626367] capitalize">
                                    Enter the password shared with you to view the full details and respond
                                </p>
                                <figure className="flex items-end mt-8 w-full">
                                    <img
                                        src="/Images/login_image.svg"
                                        alt="Illustration of a person reviewing proposals on a computer screen"
                                        className="w-full h-auto object-contain object-bottom"
                                    />
                                </figure>
                            </section>

                            <section
                                className="flex flex-col items-start self-center flex-[0_0_496px] w-[496px] max-w-full px-[46px] py-[56px] bg-white rounded-[14px] shadow-[0_8px_40px_rgba(9,8,20,0.06)] max-[1200px]:flex-none max-[1200px]:w-full max-[1200px]:max-w-[496px] max-[640px]:px-7 max-[640px]:py-10 max-[400px]:px-5 max-[400px]:py-8"
                                aria-labelledby="gate-loading-title"
                            >
                                <div className="flex flex-col items-center justify-center self-stretch gap-4 text-center py-8">
                                    <div className="w-8 h-8 border-4 border-[#e5e7eb] border-t-[#576aff] rounded-full animate-spin"></div>
                                    <p id="gate-loading-title" className="text-[#818293] text-sm">Checking link...</p>
                                </div>
                            </section>

                        </div>
                    </main>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div
                className="min-h-screen font-['DM_Sans',sans-serif]"
                style={{ background: "url('/Images/background_img.svg') #f9fafc center / cover no-repeat fixed" }}
            >
                <Toaster position="top-center" />
                <div className="flex flex-col items-center gap-[104px] w-full max-w-[1920px] min-h-screen mx-auto px-[164px] pt-[26px] pb-[167px] max-[1639px]:px-12 max-[1639px]:gap-[72px] max-[1200px]:px-10 max-[1200px]:pb-16 max-[640px]:px-5 max-[640px]:pb-12 max-[640px]:gap-12 max-[400px]:px-4 max-[400px]:gap-10">

                    <header className="flex items-center justify-between w-full shrink-0 max-[640px]:flex-col max-[640px]:gap-5">
                        <a href="#" aria-label="ProposalHub home">
                            <img src="/icons/logo.svg" alt="ProposalHub" className="h-11 w-auto max-[400px]:h-9" />
                        </a>
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
                        <div className="flex justify-between items-center w-[1286px] max-w-full mx-auto max-[1200px]:flex-col max-[1200px]:gap-12 max-[640px]:gap-8">

                            <section className="flex flex-col flex-[0_0_585px] max-w-[585px] w-full max-[1200px]:hidden" aria-hidden="true">
                                <h1 className="mb-[26px] text-[46px] font-bold tracking-[-1.38px] leading-normal text-black">
                                    Proposal
                                </h1>
                                <p className="w-full mb-[26px] text-base font-normal leading-normal text-[#626367] capitalize">
                                    You've received a proposal for your review
                                </p>
                                <p className="w-full mb-0 text-base font-normal leading-normal text-[#626367] capitalize">
                                    Enter the password shared with you to view the full details and respond
                                </p>
                                <figure className="flex items-end mt-8 w-full">
                                    <img
                                        src="/Images/login_image.svg"
                                        alt="Illustration of a person reviewing proposals on a computer screen"
                                        className="w-full h-auto object-contain object-bottom"
                                    />
                                </figure>
                            </section>

                            <section
                                className="flex flex-col items-start self-center flex-[0_0_496px] w-[496px] max-w-full px-[46px] py-[56px] bg-white rounded-[14px] shadow-[0_8px_40px_rgba(9,8,20,0.06)] max-[1200px]:flex-none max-[1200px]:w-full max-[1200px]:max-w-[496px] max-[640px]:px-7 max-[640px]:py-10 max-[400px]:px-5 max-[400px]:py-8"
                                aria-labelledby="gate-error-title"
                            >
                                <div className="flex flex-col items-center justify-center self-stretch gap-2 text-center py-8">
                                    <div className="bg-red-100 rounded-full w-14 h-14 flex items-center justify-center mb-2">
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                            <path d="M6 18L18 6M6 6l12 12" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                    <h2 id="gate-error-title" className="text-[20px] font-semibold text-[#1e1e21]">{error}</h2>
                                    <p className="text-[#818293] text-sm">This link is invalid, expired or revoked.</p>
                                </div>
                            </section>

                        </div>
                    </main>
                </div>
            </div>
        );
    }

    // Main state
    return (
        <div
            className="min-h-screen font-['DM_Sans',sans-serif]"
            style={{ background: "url('/Images/background_img.svg') #f9fafc center / cover no-repeat fixed" }}
        >
            <Toaster position="top-center" />
            <div className="flex flex-col items-center gap-[104px] w-full max-w-[1920px] min-h-screen mx-auto px-[164px] pt-[26px] pb-[167px] max-[1639px]:px-12 max-[1639px]:gap-[72px] max-[1200px]:px-10 max-[1200px]:pb-16 max-[640px]:px-5 max-[640px]:pb-12 max-[640px]:gap-12 max-[400px]:px-4 max-[400px]:gap-10">

                <header className="flex items-center justify-between w-full shrink-0 max-[640px]:flex-col max-[640px]:gap-5">
                    <a href="#" aria-label="ProposalHub home">
                        <img src="/icons/logo.svg" alt="ProposalHub" className="h-11 w-auto max-[400px]:h-9" />
                    </a>
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
                    <div className="flex justify-between items-center w-[1286px] max-w-full mx-auto max-[1200px]:flex-col max-[1200px]:gap-12 max-[640px]:gap-8">

                        <section className="flex flex-col flex-[0_0_585px] max-w-[585px] w-full max-[1200px]:hidden" aria-hidden="true">
                            <h1 className="mb-[26px] text-[46px] font-bold tracking-[-1.38px] leading-normal text-black">
                                Proposal
                            </h1>
                            <p className="w-full mb-[26px] text-base font-normal leading-normal text-[#626367] capitalize">
                                You've received a proposal for your review
                            </p>
                            <p className="w-full mb-0 text-base font-normal leading-normal text-[#626367] capitalize">
                                Enter the password shared with you to view the full details and respond
                            </p>
                            <figure className="flex items-end mt-8 w-full">
                                <img
                                    src="/Images/login_image.svg"
                                    alt="Illustration of a person reviewing proposals on a computer screen"
                                    className="w-full h-auto object-contain object-bottom"
                                />
                            </figure>
                        </section>

                        <section
                            className="flex flex-col items-start self-center flex-[0_0_496px] w-[496px] max-w-full px-[46px] py-[56px] bg-white rounded-[14px] shadow-[0_8px_40px_rgba(9,8,20,0.06)] max-[1200px]:flex-none max-[1200px]:w-full max-[1200px]:max-w-[496px] max-[640px]:px-7 max-[640px]:py-10 max-[400px]:px-5 max-[400px]:py-8"
                            aria-labelledby="gate-title"
                        >
                            <h2
                                id="gate-title"
                                className="self-stretch mb-8 text-[26px] font-semibold leading-normal text-[#1e1e21] text-center max-[400px]:text-2xl max-[400px]:mb-6"
                            >
                                Unlock to View
                            </h2>

                            <div className="flex flex-col items-start self-stretch w-full gap-[10px]">
                                <label className="block text-lg font-medium leading-normal text-[#555665] max-[400px]:text-base" htmlFor="gate-password">
                                    Password
                                </label>
                                <div className="flex items-center gap-[10px] h-[54px] px-[10px] w-full bg-white border border-[#c3c5d0] rounded-[4px] transition-colors focus-within:border-[#576aff]">
                                    <span className="flex-none w-6 h-6 text-[#818293]" aria-hidden="true">
                                        <img src="/icons/lock.svg" alt="" className="w-7 h-7" />
                                    </span>
                                    <input
                                        className="flex-1 w-full min-w-0 h-full text-base font-normal text-[#1e1e21] bg-transparent border-none outline-none placeholder:font-medium placeholder:text-[#818293]"
                                        type={showPassword ? "text" : "password"}
                                        id="gate-password"
                                        name="password"
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <span
                                        className="text-[#818293] cursor-pointer"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handleVerifyPassword}
                                disabled={verify}
                                className="flex items-center justify-center self-stretch w-full max-w-[410px] h-[42px] mt-[28px] p-[10px] text-lg font-bold text-white bg-[#576aff] border-none rounded-[3px] cursor-pointer transition-colors hover:bg-[#3d52f2] active:scale-[0.995] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {verify ? 'Unlocking...' : 'Unlock Proposal'}
                            </button>

                            <p className="self-stretch text-center text-[#818293] text-xs mt-4">
                                No account required to view this proposal
                            </p>
                        </section>

                    </div>
                </main>
            </div>
        </div>
    );
}

export default PasswordGate;