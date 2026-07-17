import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { getSignatureByProposalAPI } from "../../../services/allAPI";

function ViewProposalPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const proposal = location.state?.proposal;
    const [signature, setSignature] = useState(null);

    useEffect(() => {
        const getSignature = async () => {
            const token = localStorage.getItem("token");
            const reqHeader = {
                Authorization: `Bearer ${token}`,
            };

            const response = await getSignatureByProposalAPI(
                proposal.id,
                reqHeader
            );

            if (response?.status === 200) {
                setSignature(response.data);
            }
        };

        if (proposal?.id) {
            getSignature();
        }
    }, [proposal?.id]);

    return (
        <div
            className="min-h-screen bg-[#f9fafc]"
            style={{
                background:
                    "url('/Images/background_img.svg') #f9fafc center / cover no-repeat fixed",
            }}
        >
            <Sidebar />

            <div className="max-w-[1591px] mx-auto px-10 py-8">
                <div className="p-6 rounded-[16px] flex gap-6 items-start">
                    {/* Left Section */}
                    <div className="w-[32%] shrink-0 flex flex-col">
                        <h2 className="text-2xl font-bold mb-5 leading-none">
                            Proposal Details
                        </h2>

                        <div className="space-y-3">
                            <p>
                                <b>Client :</b> {proposal?.client_name}
                            </p>
                            <p>
                                <b>Project :</b> {proposal?.project_name}
                            </p>
                            <p>
                                <b>Cost :</b> ₹{proposal?.cost}
                            </p>
                            <p>
                                <b>Status :</b> {proposal?.status}
                            </p>
                            <p>
                                <b>Description :</b> {proposal?.description}
                            </p>
                            <p>
                                <b>Created Date :</b>{" "}
                                {proposal?.created_at?.slice(0, 10)}
                            </p>
                        </div>

                        {/* Client Response */}
                        {signature ? (
                            <div className="mt-5 border-t pt-4 space-y-3">
                                <h3 className="font-semibold text-sm">
                                    Client Response
                                </h3>

                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">
                                        Decision :
                                    </span>

                                    <span
                                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                            signature.decision === "Accepted"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {signature.decision}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-500">
                                    Signed on :{" "}
                                    {signature.signed_at?.slice(0, 10)}
                                </p>

                                {signature.decision === "Accepted" &&
                                    signature.signature_image_url && (
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">
                                                Signature :
                                            </p>

                                            <img
                                                src={
                                                    signature.signature_image_url
                                                }
                                                alt="Client Signature"
                                                className="border rounded p-2 bg-gray-50 max-h-24 object-contain"
                                            />
                                        </div>
                                    )}

                                {signature.certificateUrl && (
                                    
                                        <a href={signature.certificateUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        download
                                        className="inline-flex items-center gap-2 bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800 transition-all"
                                    >
                                        ⬇ Download Certificate
                                    </a>
                                )}
                            </div>
                        ) : (
                            <div className="mt-5 border-t pt-4">
                                <p className="text-sm text-gray-400">
                                    No client response yet.
                                </p>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-8">
                            {signature && (
                                <button
                                    onClick={() =>
                                        navigate("/success", {
                                            state: {
                                                proposal,
                                                decision: signature.decision,
                                                signature,
                                            },
                                        })
                                    }
                                    className="h-[45px] px-4 text-sm font-medium text-white bg-[#576aff] rounded hover:bg-[#3d52f2]"
                                >
                                    View Response
                                </button>
                            )}

                            <button
                                onClick={() => navigate(-1)}
                                className="h-[45px] px-4 text-sm font-medium text-white bg-[#576aff] rounded hover:bg-[#3d52f2]"
                            >
                                Back
                            </button>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex-1 flex flex-col">
                        <h3 className="text-2xl font-bold mb-5 leading-none text-gray-500">
                            Proposal Document
                        </h3>

                        {proposal?.document_url ? (
                            <iframe
                                src={proposal.document_url}
                                width="95%"
                                style={{ height: "580px" }}
                                title="PDF Viewer"
                                className="border rounded"
                            />
                        ) : (
                            <div
                                className="border-2 border-dashed rounded flex items-center justify-center text-gray-400"
                                style={{ height: "780px" }}
                            >
                                No document uploaded
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewProposalPage;