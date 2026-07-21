import React, { useState, useEffect } from "react";
import { generateLinkAPI, getLinkByProposalAPI, getSignatureByProposalAPI, revokeLinkAPI, unrevokeLinkAPI, updateProposalStatusAPI, genereteProposalStatusAPI } from "../../services/allAPI";
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
function GenerateLinkModal({ onClose, proposalId, proposal }) {
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [expiryDate, setExpiryDate] = useState('')
    const [generatedLink, setGeneratedLink] = useState('')
    const [generatedToken, setGeneratedToken] = useState('')
    const [isRevoked, setIsRevoked] = useState(false)
    const [isSent, setIsSent] = useState(false)
    const [sentStatusId, setSentStatusId] = useState(null)

    const token = localStorage.getItem('token')
    const reqHeader = { Authorization: `Bearer ${token}` }
    useEffect(() => {
        const getSentStatusId = async () => {
            const response = await genereteProposalStatusAPI(reqHeader)
            if (response.status === 200) {
                const sentStatus = response.data.find(s => s.status_name === 'Sent')
                if (sentStatus) setSentStatusId(sentStatus.id)
            }
        }
        getSentStatusId()

        const getExistingLink = async () => {
            const response = await getLinkByProposalAPI(proposalId, reqHeader)
            if (response.status === 200) {
                const link = `${window.location.origin}/view/${response.data.token}`
                setGeneratedLink(link)
                setGeneratedToken(response.data.token)
                setIsRevoked(response.data.is_revoked)
                setPassword(response.data.password || '')
            }
        }
        getExistingLink()
    }, [])

    const handleGenerate = async () => {
        if (!password || !expiryDate) {
            toast.error('Please fill all fields!')
            return
        }
        const response = await generateLinkAPI({ proposalId, password, expiryDate }, reqHeader)
        if (response.status === 200) {
            setGeneratedLink(response.data.link)
            setGeneratedToken(response.data.token)
        } else if (response.data.hasExistingLink) {
            const confirm = window.confirm('Link already exists. Regenerate?')
            if (confirm) {
                const regenResponse = await generateLinkAPI({ proposalId, password, expiryDate, forceRegenerate: true }, reqHeader)
                if (regenResponse.status === 200) {
                    setGeneratedLink(regenResponse.data.link)
                    setGeneratedToken(regenResponse.data.token)
                    // console.log(response);
                }
            }
        } else {
            toast.error(response?.data?.message || 'Something went wrong!')
        }
    }
    const handleRevoke = async () => {

        const response = await revokeLinkAPI({ token: generatedToken }, reqHeader)
        console.log(response);
        if (response.status === 200) {
            toast.success('Link Revoked Successfully!')
            setIsRevoked(true)


        } else {
            toast.error('Failed to revoke link')
        }
    }

    const handleUnrevoke = async () => {

        const response = await unrevokeLinkAPI({ token: generatedToken }, reqHeader)
        if (response.status === 200) {
            toast.success('Link UnRevoked Successfullyy!')
            setIsRevoked(false)
            console.log(response);

        } else {
            toast.error('Failed to unrevoke link')
        }
    }
    const handleViewDecision = async () => {
        const response = await getSignatureByProposalAPI(proposalId, reqHeader)
        if (response.status === 200) {
            navigate('/success', {
                state: {
                    proposal,
                    decision: response.data.decision,
                    signature: response.data
                }
            })
        } else {
            alert('No signature found yet')
        }
    }

    const handleMarkAsSent = async () => {
        if (!sentStatusId) {
            toast.error('Status list not loaded yet, try again')
            return
        }
        const response = await updateProposalStatusAPI(proposalId, { statusId: sentStatusId }, reqHeader)
        if (response.status === 200) {
            toast.success('Status Updated successfully')
            setIsSent(true)
        } else {
            toast.error(response.data.message || response.data.error || 'Failed to update status')
        }
    }
    const handleCopyLink = () => {
        navigator.clipboard.writeText(generatedLink)
        toast.success('Link Copied!')
    }

    const handleCopyPassword = () => {
        navigator.clipboard.writeText(password)
        toast.success('Password Copied!')
    }

    return (
        <>
            <Toaster position="top-center" />
            <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-50 px-4 py-8">

                <div
                    className={`rounded-[16px] shadow-[0_4px_8px_rgba(214,214,214,0.4)] w-full transition-all duration-200 ${generatedLink ? 'max-w-4xl' : 'max-w-md'}`}
                    style={{
                        background:
                            "url('/Images/background_img.svg') #ffffff center /cover no-repeat",
                    }}
                >
                    <div className="p-8 sm:p-10 flex flex-col gap-8">

                        <div>
                            <h2 className="text-xl font-semibold text-[#3f4050] mb-1">Generate Access Link</h2>
                            <p className="text-gray-500 text-sm">
                                Set a password and expiry date for the client link.
                            </p>
                        </div>

                        <div className={`grid gap-8 ${generatedLink ? 'grid-cols-1 md:grid-cols-2 md:gap-10' : 'grid-cols-1'}`}>

                            <div className="flex flex-col gap-5">
                                <div>
                                    <label className="text-sm text-gray-500 mb-1.5 block">Password for Client</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Password"
                                        className="border p-2.5 rounded w-full"
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-gray-500 mb-1.5 block">Expiry Date</label>
                                    <input
                                        type="date"
                                        className="border p-2.5 rounded w-full"
                                        onChange={(e) => setExpiryDate(e.target.value)}
                                    />
                                </div>

                                <button
                                    onClick={handleGenerate}
                                    className="w-full bg-[#576aff] text-white py-2.5 rounded font-medium cursor-pointer"
                                >
                                    Generate Link
                                </button>
                            </div>

                            {generatedLink && (
                                <div className="flex flex-col gap-4 md:pl-10 md:border-l md:border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">Generated Link:</p>
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full
        ${isRevoked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                            {isRevoked ? 'Revoked' : 'Active'}
                                        </span>
                                    </div>

                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={generatedLink}
                                            readOnly
                                            className="border p-2.5 rounded w-full text-sm"
                                        />
                                        <button
                                            onClick={handleCopyLink}
                                            className="shrink-0 bg-[#576aff] text-white text-xs px-3 py-1 rounded cursor-pointer"
                                        >
                                            Copy Link
                                        </button>
                                    </div>

                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={password}
                                            readOnly
                                            className="border p-2.5 rounded w-full text-sm"
                                        />
                                        <button
                                            onClick={handleCopyPassword}
                                            className="shrink-0 bg-[#576aff] text-white text-xs px-3 py-1 rounded cursor-pointer"
                                        >
                                            Copy Password
                                        </button>
                                    </div>

                                    {!isSent && proposal?.status_name !== 'Sent' &&
                                        proposal?.status_name !== 'Accepted' &&
                                        proposal?.status_name !== 'Rejected' && (
                                            <button
                                                onClick={handleMarkAsSent}
                                                className="w-full bg-green-600 text-white py-2.5 rounded font-medium cursor-pointer"
                                            >
                                                Mark as Sent
                                            </button>
                                        )}

                                    {(isSent || proposal?.status_name === 'Sent') && (
                                        <p className="text-center text-sm text-yellow-600 font-medium">
                                            ✓ Marked as Sent
                                        </p>
                                    )}

                                    {isRevoked ? (
                                        <button
                                            onClick={handleUnrevoke}
                                            className="w-full border border-blue-500 text-blue-500 py-2.5 rounded font-medium cursor-pointer"
                                        >
                                            Unrevoke Link
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleRevoke}
                                            className="w-full border border-red-500 text-red-500 py-2.5 rounded font-medium cursor-pointer"
                                        >
                                            Revoke Link
                                        </button>
                                    )}

                                    {(proposal?.status_name === 'Accepted' || proposal?.status_name === 'Rejected') && (
                                        <button
                                            onClick={handleViewDecision}
                                            className={`w-full whitespace-nowrap p-3 rounded-[8px] font-medium cursor-pointer border transition-all
${proposal?.status_name === 'Rejected'
                                                    ? 'border-red-500 text-red-600 hover:bg-red-50'
                                                    : 'border-[#576aff] text-[#576aff] hover:bg-[#576aff] hover:text-white'
                                                }`}
                                        >
                                            View {proposal?.status_name} Decision & Download PDF
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col items-center gap-3 pt-6 border-t border-gray-100">
                            <p className="text-gray-400 text-xs text-center">
                                Client can access the proposal using this link and password.
                            </p>
                            <button
                                onClick={onClose}
                                className="w-56 py-2 border-2 border-[#576aff] text-[#576aff] rounded-lg hover:bg-[#576aff] hover:text-white transition"
                            >
                                Close
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )

}

export default GenerateLinkModal