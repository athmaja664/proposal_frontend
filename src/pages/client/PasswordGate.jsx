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
            <div className="min-h-screen bg-blue-50">
                <Toaster position="top-center" />
                <Topbar />
                <div className="flex items-center justify-center py-16 px-4">
                    <div className="bg-white rounded-lg shadow p-8 w-full max-w-sm text-center">
                        <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-3"></div>
                        <p className="text-gray-500 text-sm">Checking link...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-blue-50">
                   <Toaster position="top-center" />
                <Topbar />
                <div className="flex items-center justify-center py-16 px-4">
                    <div className="bg-white rounded-lg shadow p-8 w-full max-w-sm text-center">
                        <div className="bg-red-100 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                <path d="M6 18L18 6M6 6l12 12" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <h2 className="text-lg font-semibold mb-1">{error}</h2>
                        <p className="text-gray-500 text-sm">This link is invalid, expired or revoked.</p>
                    </div>
                </div>
            </div>
        );
    }

    // Main state
    return (
        <div className="min-h-screen bg-blue-50">
            <Toaster position="top-center" />
            <Topbar />
            <div className="flex items-center justify-center py-16 px-4">
                <div className="bg-white rounded-lg shadow p-8 w-full max-w-sm text-center">
                    <div className="bg-blue-100 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                stroke="#000000" strokeWidth="2" strokeLinecap="round"
                            />
                        </svg>
                    </div>
                    <h2 className="text-lg font-semibold mb-1">This proposal is protected</h2>
                    <p className="text-gray-500 text-sm mb-5">
                        Enter the password shared by the sender to view this proposal.
                    </p>
                    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 mb-4 bg-gray-50">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            className="flex-1 bg-transparent outline-none text-sm text-gray-700"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span
                            className="text-gray-400 ml-2 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                        </span>
                    </div>
                    <button
                        onClick={handleVerifyPassword}
                        disabled={verify}
                        className="w-full text-white py-2 rounded font-medium cursor-pointer disabled:opacity-60"
                        style={{ background: "linear-gradient(145deg, #111111 0%, #333333 100%)" }}
                    >
                        {verify ? 'Unlocking...' : 'Unlock Proposal'}
                    </button>
                    <p className="text-gray-400 text-xs mt-4">No account required to view this proposal</p>
                </div>
            </div>
        </div>
    );
}

const Topbar = () => (
    <div className="bg-black px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <div className="bg-white rounded-md p-1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12h6M9 16h6M9 8h3M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
                        stroke="#060607" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </div>
            <span className="text-white font-medium text-sm">ProposalHub</span>
        </div>
        <span className="text-blue-200 text-xs">Secure proposal viewer</span>
    </div>
);

export default PasswordGate;