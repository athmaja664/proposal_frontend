import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { serverURL } from "../../../services/serverURL";
import { FaPencilAlt } from "react-icons/fa";
import { FaCloudUploadAlt } from "react-icons/fa";
import { submitSignatureAPI } from "../../../services/allAPI";

function ProposalViewer() {

    const navigate = useNavigate();
    const location = useLocation();
    const proposal = location.state?.proposal;

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [decision, setDecision] = useState('')
    const [signatureMethod, setSignatureMethod] = useState('draw')
    const canvasRef = useRef(null)
    const fileInputRef = useRef(null)
    const [uploadedFile, setUploadedFile] = useState(null)
    const [loading, setLoading] = useState(false)
    //cursor-status 
    const [showStatusDropdown, setShowStatusDropdown] = useState(false)
    const statusDropdownRef = useRef(null)
    // popup state (replaces window.confirm / alert)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')

    // works for both mouse events (e.clientX/Y) and touch events (e.touches[0])
    const getCoords = (e, canvas) => {
        const rect = canvas.getBoundingClientRect()
        const scaleX = canvas.width / rect.width
        const scaleY = canvas.height / rect.height
        const point = e.touches && e.touches.length > 0 ? e.touches[0] : e
        return {
            x: (point.clientX - rect.left) * scaleX,
            y: (point.clientY - rect.top) * scaleY
        }
    }

    const startDrawing = (e) => {
        if (e.touches) e.preventDefault()
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const { x, y } = getCoords(e, canvas)
        ctx.beginPath()
        ctx.moveTo(x, y)
        canvas.isDrawing = true
    }

    const draw = (e) => {
        const canvas = canvasRef.current
        if (!canvas.isDrawing) return
        if (e.touches) e.preventDefault()
        const ctx = canvas.getContext('2d')
        const { x, y } = getCoords(e, canvas)
        ctx.lineTo(x, y)
        ctx.strokeStyle = '#000'
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.stroke()
    }

    const stopDrawing = () => {
        const canvas = canvasRef.current
        canvas.isDrawing = false
    }

    const clearCanvas = () => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    const getSignatureImage = () => {
        const canvas = canvasRef.current
        return canvas.toDataURL('image/png')
    }

    // Step 1: validate and open confirm popup (was: window.confirm)
    const handleSubmit = () => {
        if (!agreed || !decision) {
            setAlertMessage('Please fill all fields and accept the terms.')
            return
        }
        setShowConfirmModal(true)
    }

    // Step 2: runs after user confirms in the popup (same body as before)
    const doSubmit = async () => {
        setShowConfirmModal(false)
        setLoading(true)
        try {
            let response

            if (decision === 'Rejected') {
                response = await submitSignatureAPI(
                    { proposalId: proposal.id, decision: 'Rejected' },
                    { 'Content-Type': 'application/json' }
                )
            } else if (signatureMethod === 'draw') {
                const signatureBase64 = getSignatureImage()
                response = await submitSignatureAPI(
                    { proposalId: proposal.id, decision, signatureMethod, signatureBase64 },
                    { 'Content-Type': 'application/json' }
                )
            } else if (signatureMethod === 'upload') {
                const fd = new FormData()
                fd.append('proposalId', proposal.id)
                fd.append('decision', decision)
                fd.append('signatureMethod', 'upload')
                fd.append('signatureFile', uploadedFile)
                response = await submitSignatureAPI(fd, null)
            }
            console.log(response);
            if (response.status === 201 || response.status === 200) {
                navigate('/success', {
                    state: {
                        proposal,
                        decision,
                        signature: response.data.newSignature
                    }
                })
            } else {
                setAlertMessage(response.data.error)
                setLoading(false)
            }

        } catch (err) {
            setAlertMessage('Something went wrong.')
            setLoading(false)
        }
    }

    useEffect(() => {
    const handleClickOutsideStatus = (e) => {
        if (statusDropdownRef.current && !statusDropdownRef.current.contains(e.target)) {
            setShowStatusDropdown(false)
        }
    }
    document.addEventListener('mousedown', handleClickOutsideStatus)
    return () => {
        document.removeEventListener('mousedown', handleClickOutsideStatus)
    }
}, [])

    if (!proposal) {
        return (
            <div
                className="min-h-screen font-['DM_Sans',sans-serif] flex items-center justify-center"
                style={{ background: "url('/Images/background_img.svg') #f9fafc center / cover no-repeat fixed" }}
            >
                <p className="text-gray-500"></p>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen font-['DM_Sans',sans-serif]"
            style={{ background: "url('/Images/background_img.svg') #f9fafc center / cover no-repeat fixed" }}
        >
            <header className="flex items-center justify-between w-full shrink-0 px-[164px] py-[26px] max-[1639px]:px-12 max-[1200px]:px-10 max-[640px]:px-5 max-[640px]:flex-col max-[640px]:gap-5">
                <a href="#" aria-label="ProposalHub home">
                    <img src="/icons/logo.svg" alt="ProposalHub" className="h-11 w-auto" />
                </a>
                <nav className="flex items-center gap-4" aria-label="Social media links">
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

            <div
                className="max-w-[95vw] mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6 items-start lg:h-[calc(100vh-60px)]"
            >

                <div className="w-full lg:w-[45%] lg:h-[84vh] lg:overflow-y-auto lg:pr-2">

                    <div className="bg-white rounded-[14px] shadow-[0_8px_40px_rgba(9,8,20,0.06)] p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4">
                            <div>
                                <h2 className="text-lg sm:text-xl font-semibold break-words">{proposal.project_name}</h2>
                                <p className="text-gray-500 text-sm">Prepared for {proposal.client_name}</p>
                            </div>
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full self-start">
                                Sent
                            </span>
                        </div>
                        <div className="border-t pt-4 space-y-2">
                            <div className="flex flex-col sm:flex-row sm:justify-between text-sm gap-0.5">
                                <span className="text-gray-500">Project Name</span>
                                <span className="font-medium break-words sm:text-right">{proposal.project_name}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between text-sm gap-0.5">
                                <span className="text-gray-500">Client Name</span>
                                <span className="font-medium break-words sm:text-right">{proposal.client_name}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between text-sm gap-0.5">
                                <span className="text-gray-500">Description</span>
                                <span className="font-medium break-words sm:text-right">{proposal.description}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between text-sm gap-0.5">
                                <span className="text-gray-500">Cost</span>
                                <span className="font-medium sm:text-right">₹{proposal.cost}</span>
                            </div>
                        </div>

                        <div className="bg-white mt-5 p-2 sm:p-6">
                            <h3 className="text-base sm:text-lg font-semibold mb-1">Sign & Accept This Proposal</h3>
                            <p className="text-gray-500 text-sm mb-5">
                                By signing you confirm acceptance of the terms in this proposal.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Client Name</label>
                                    <input
                                        type="text"
                                        className="border border-[#c3c5d0] p-2 rounded-[4px] w-full text-sm focus:outline-none focus:border-[#576aff]"
                                        value={proposal?.client_name}
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Client Email</label>
                                    <input
                                        type="email"
                                        className="border border-[#c3c5d0] p-2 rounded-[4px] w-full text-sm focus:outline-none focus:border-[#576aff]"
                                        value={proposal?.client_email}
                                        disabled
                                    />
                                </div>
                            </div>

                            {decision === 'Accepted' && (
                                <>
                                    <p className="text-xs text-gray-500 mb-3">Choose signature method</p>

                                    <div
                                        onClick={() => setSignatureMethod('draw')}
                                        className={`flex items-center gap-3 border rounded-lg p-3 mb-2 cursor-pointer transition-all
                                ${signatureMethod === 'draw' ? 'border-[#576aff] bg-[#f7f7fb]' : 'border-gray-200'}`}
                                    >
                                        <div className={`w-8 h-8 shrink-0 rounded flex items-center justify-center text-sm
                                ${signatureMethod === 'draw' ? 'bg-[#576aff] text-white' : 'bg-gray-100 text-gray-500'}`}>
                                            <FaPencilAlt />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Draw signature</p>
                                            <p className="text-xs text-gray-400">Sign using your mouse or finger</p>
                                        </div>
                                    </div>

                                    <div
                                        onClick={() => setSignatureMethod('upload')}
                                        className={`flex items-center gap-3 border rounded-lg p-3 mb-3 cursor-pointer transition-all
                                ${signatureMethod === 'upload' ? 'border-[#576aff] bg-[#f7f7fb]' : 'border-gray-200'}`}
                                    >
                                        <div className={`w-8 h-8 shrink-0 rounded flex items-center justify-center text-sm
                                ${signatureMethod === 'upload' ? 'bg-[#576aff] text-white' : 'bg-gray-100 text-gray-500'}`}>
                                            <FaCloudUploadAlt />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Upload signature</p>
                                            <p className="text-xs text-gray-400">Upload an image of your signature</p>
                                        </div>
                                    </div>

                                    {signatureMethod === 'draw' && (
                                        <div className="border rounded-lg overflow-hidden mb-4">
                                            <div className="bg-gray-50 border-b px-3 py-2 flex justify-between items-center">
                                                <span className="text-xs text-gray-500">Draw your signature below</span>
                                                <button onClick={clearCanvas} className="text-xs border px-2 py-1 rounded text-gray-500 cursor-pointer">
                                                    Clear
                                                </button>
                                            </div>
                                            <canvas
                                                ref={canvasRef}
                                                width={540}
                                                height={230}
                                                className="w-full block cursor-crosshair touch-none"
                                                style={{ height: '230px', maxWidth: '100%' }}
                                                onMouseDown={startDrawing}
                                                onMouseMove={draw}
                                                onMouseUp={stopDrawing}
                                                onMouseLeave={stopDrawing}
                                                onTouchStart={startDrawing}
                                                onTouchMove={draw}
                                                onTouchEnd={stopDrawing}
                                                onTouchCancel={stopDrawing}
                                            />
                                        </div>
                                    )}

                                    {signatureMethod === 'upload' && (
                                        <div
                                            className="border-2 border-dashed rounded-lg p-6 text-center mb-4 cursor-pointer"
                                            onClick={() => fileInputRef.current.click()}
                                        >
                                            <p className="text-sm text-gray-500 mb-1">Click to upload signature image</p>
                                            <p className="text-xs text-gray-400">PNG, JPG up to 2MB</p>
                                            {uploadedFile && <p className="text-xs text-green-600 mt-2 break-words">{uploadedFile.name}</p>}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                ref={fileInputRef}
                                                onChange={(e) => setUploadedFile(e.target.files[0])}
                                            />
                                        </div>
                                    )}
                                </>
                            )}

                            <div className="grid grid-cols-1 gap-3 mb-4">
                                {/* <div className="mb-4">
                                    <label className="text-xs text-gray-500 mb-1 block">Your Decision</label>
                                    <select
                                        value={decision}
                                        onChange={(e) => setDecision(e.target.value)}
                                        className="w-full border border-[#c3c5d0] p-2 rounded-[4px] text-sm focus:outline-none focus:border-[#576aff] cursor-pointer"
                                    >
                                        <option value="" className="cursor-pointer">-- Select Decision --</option>
                                        <option value="Rejected">Reject Proposal</option>
                                        <option value="Accepted">Accept Proposal</option>
                                    </select>
                                </div> */}
                                <div className="relative" ref={statusDropdownRef}>
                                    <button
                                        type="button"
                                        onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                                        className="w-full px-4 py-2 rounded-[8px] border-2 border-[#d9dce8] text-sm text-left bg-white cursor-pointer flex justify-between items-center"
                                    >
                                        {decision === 'Accepted'
                                            ? 'Accept Proposal'
                                            : decision === 'Rejected'
                                                ? 'Reject Proposal'
                                                : '-- Select Decision --'}
                                        <span className="text-[#818293]">▾</span>
                                    </button>
                                    {showStatusDropdown && (
                                        <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-lg shadow-lg border border-[#e7e7eb] z-20 overflow-hidden">
                                            <div
                                                onClick={() => {
                                                    setDecision('Rejected')
                                                    setShowStatusDropdown(false)
                                                }}
                                                className="px-4 py-2 text-sm cursor-pointer hover:bg-[#f5f7ff]"
                                            >
                                                Reject Proposal
                                            </div>
                                            <div
                                                onClick={() => {
                                                    setDecision('Accepted')
                                                    setShowStatusDropdown(false)
                                                }}
                                                className="px-4 py-2 text-sm cursor-pointer hover:bg-[#f5f7ff]"
                                            >
                                                Accept Proposal
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-start gap-2 mb-5">
                                <input
                                    type="checkbox"
                                    className="mt-1 cursor-pointer shrink-0"
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                />
                                <p className="text-sm text-gray-500">
                                    I have read and agree to the terms of this proposal and confirm my acceptance.
                                </p>
                            </div>
                            <button
                                onClick={handleSubmit}
                                className="w-full text-white py-2 rounded-[3px] font-bold cursor-pointer transition-colors bg-[#576aff] hover:bg-[#3d52f2] active:scale-[0.995]"
                            >
                                {loading ? 'Submitting...' : 'Submit Report'}

                            </button>
                            <p className="text-gray-400 text-xs text-center mt-3">
                                Your IP address and timestamp will be recorded on submission.
                            </p>
                        </div>
                    </div>



                </div>
                <div className="w-full lg:w-[55%] flex flex-col">
                    {proposal.document_url ? (
                        <div className="bg-white rounded-[14px] shadow-[0_8px_40px_rgba(9,8,20,0.06)] p-4 flex flex-col h-full">
                            <h3 className="font-medium mb-3">Proposal Document</h3>
                            <iframe
                                src={proposal.document_url}
                                width="100%"
                                style={{ height: '60vh' }}
                                className="lg:h-[520px] border rounded"
                                title="PDF Viewer"
                            />

                        </div>
                    ) : (
                        <div className="bg-white rounded-[14px] shadow-[0_8px_40px_rgba(9,8,20,0.06)] p-6 flex items-center justify-center h-[300px] lg:h-full">
                            <p className="text-gray-400 text-sm">No document attached to this proposal.</p>
                        </div>
                    )}
                </div>

            </div>

            {/* Confirm popup (replaces window.confirm) */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-[14px] shadow-[0_8px_40px_rgba(9,8,20,0.06)] w-full max-w-sm p-6 text-center">
                        <h3 className="text-lg font-semibold text-[#1e1e21] mb-2">Confirm Submission</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Are you sure you want to submit your decision?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="flex-1 py-2 rounded-[3px] font-medium border border-[#c3c5d0] text-[#555665] cursor-pointer transition-colors hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={doSubmit}
                                className="flex-1 py-2 rounded-[3px] font-bold text-white bg-[#576aff] cursor-pointer transition-colors hover:bg-[#3d52f2]"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Alert popup (replaces alert()) */}
            {alertMessage && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-[14px] shadow-[0_8px_40px_rgba(9,8,20,0.06)] w-full max-w-sm p-6 text-center">
                        <p className="text-sm text-[#1e1e21] mb-6">{alertMessage}</p>
                        <button
                            onClick={() => setAlertMessage('')}
                            className="w-full py-2 rounded-[3px] font-bold text-white bg-[#576aff] cursor-pointer transition-colors hover:bg-[#3d52f2]"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProposalViewer;