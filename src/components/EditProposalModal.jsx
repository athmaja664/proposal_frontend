import React, { useState, useEffect } from "react";
import { updatedProposalAPI, genereteProposalStatusAPI } from "../../services/allAPI";
import toast, { Toaster } from 'react-hot-toast'
function EditProposalModal({ onClose, proposal, getProposals }) {
    const [statuses, setStatuses] = useState([])
    const [proposalData, setProposalData] = useState({
        cost: proposal?.cost || '',
        statusId: proposal?.status_id || '',
        description: proposal?.description || '',
        document: ''
    })

    const token = localStorage.getItem('token')
    const reqHeader = { Authorization: `Bearer ${token}` }

    // fetch statuses for the dropdown
    const getStatuses = async () => {
        const response = await genereteProposalStatusAPI(reqHeader)
        if (response.status === 200) {
            setStatuses(response.data)
        }
    }

    useEffect(() => {
        getStatuses()
    }, [])

    const handleUpdate = async () => {
        const fileHeader = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
        }
        const formData = new FormData()
        formData.append('cost', proposalData.cost)
        formData.append('statusId', proposalData.statusId)
        formData.append('description', proposalData.description)
        if (proposalData.document) {
            formData.append('document', proposalData.document)
        }
        const response = await updatedProposalAPI(proposal.id, formData, fileHeader)
        if (response.status === 200) {
            toast.success('Proposal Updated')
            getProposals()
            setTimeout(() => {
                onClose()
            }, 1000)
        } else {
            toast.error(response.data.message || response.data.error || 'Something went wrong')
        }
    }

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-50 px-4">
            <Toaster position="top-center" />
            <div
                className="p-6 rounded-[16px] shadow-[0_4px_8px_0_rgba(214,214,214,0.4)] w-[90vw] max-w-5xl flex gap-6"
                style={{
                    background: "url('/Images/background_img.svg') #ffffff center / cover no-repeat"
                }}
            >

                {/* LEFT - Form */}
                <div className="flex-1 flex flex-col">
                    <h2 className="text-xl font-semibold mb-4">Edit Proposal</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-gray-500 mb-1 block">Client</label>
                            <input
                                type="text"
                                value={proposal?.client_name}
                                disabled
                                className="border p-2 rounded w-full bg-gray-100"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-500 mb-1 block">Project</label>
                            <input
                                type="text"
                                value={proposal?.project_name}
                                disabled
                                className="border p-2 rounded w-full bg-gray-100"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-500 mb-1 block">Cost</label>
                            <input
                                type="number"
                                placeholder="5000"
                                value={proposalData.cost}
                                className="border p-2 rounded w-full"
                                onChange={(e) => setProposalData({ ...proposalData, cost: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-500 mb-1 block">Status</label>
                            <select
                                value={proposalData.statusId}
                                className="border p-2 rounded w-full"
                                onChange={(e) => setProposalData({ ...proposalData, statusId: e.target.value })}
                            >
                                {statuses.map(status => (
                                    <option key={status.id} value={status.id}>{status.status_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="text-sm text-gray-500 mb-1 block">Description</label>
                        <textarea
                            placeholder="Proposal description"
                            value={proposalData.description}
                            className="w-full border p-2 rounded"
                            rows="3"
                            onChange={(e) => setProposalData({ ...proposalData, description: e.target.value })}
                        />
                    </div>

                    <div className="mt-4">
                        <label className="text-sm text-gray-500 mb-1 block">Replace Document (optional)</label>
                        <div className="border-2 border-dashed p-4 text-center rounded text-gray-500">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setProposalData({ ...proposalData, document: e.target.files[0] })}
                            />
                        </div>
                        {proposalData.document && (
                            <p className="text-xs text-green-600 mt-1">{proposalData.document.name} selected</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button onClick={onClose} className="inline-flex items-center justify-center gap-2 h-[45px] px-4 text-sm font-medium text-white bg-[#576aff] rounded-[4px] no-underline hover:bg-[#3d52f2] transition-colors whitespace-nowrap">
                            Cancel
                        </button>
                        <button onClick={handleUpdate} className="inline-flex items-center justify-center gap-2 h-[45px] px-4 text-sm font-medium text-white bg-[#576aff] rounded-[4px] no-underline hover:bg-[#3d52f2] transition-colors whitespace-nowrap">
                            Update Proposal
                        </button>
                    </div>
                </div>

                {/* RIGHT - PDF Preview */}
                <div className="w-[45%] flex flex-col">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Current Document</h3>
                    {proposal?.document_url ? (
                        <iframe
                            src={proposal.document_url}
                            width="100%"
                            style={{ height: '520px' }}
                            title="PDF Viewer"
                            className="border rounded"
                        />
                    ) : (
                        <div
                            className="border-2 border-dashed rounded flex items-center justify-center text-gray-400 text-sm"
                            style={{ height: '520px' }}
                        >
                            No document uploaded
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default EditProposalModal