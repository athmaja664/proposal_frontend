import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import EditClientModal from "../../components/EditClientModal";
import { HiDotsVertical } from "react-icons/hi";
import { FiMail, FiPhone } from "react-icons/fi";
import { deleteClientAPI, getclientAPI } from "../../../services/allAPI";
import toast from "react-hot-toast";

const avatarColors = [
    'from-[#576aff] to-[#7c8cff]',
    'from-[#22c55e] to-[#4ade80]',
    'from-[#f97316] to-[#fb923c]',
    'from-[#ec4899] to-[#f472b6]',
    'from-[#8b5cf6] to-[#a78bfa]',
    'from-[#0ea5e9] to-[#38bdf8]',
]

const getAvatarColor = (id) => {
    return avatarColors[id % avatarColors.length]
}

function AddClient() {
    const [showModal, setShowModal] = useState(false)
    const [selectedClient, setSelectedClient] = useState(null)
    const [confirmDeleteId, setConfirmDeleteId] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [clientData, setClientData] = useState([])
    const token = localStorage.getItem('token')
    const getClient = async () => {
        const reqHeader = { Authorization: `Bearer ${token}` }
        const response = await getclientAPI(reqHeader)
        if (response.status === 200) {
            setClientData(response.data)
        }
    }

    const handleDelete = async (id) => {
        const reqHeader = { Authorization: `Bearer ${token}` }
        const response = await deleteClientAPI(id, reqHeader)
        if (response.status === 200) {
            setConfirmDeleteId(null)
            toast.success('Client deleted successfully')
            getClient()
        } else {
            toast.error('Failed to deleted Client')
        }
    }
    useEffect(() => {
        getClient()
    }, [])
    const cardsPerPage = 8
    const lastIndex = currentPage * cardsPerPage
    const firstIndex = lastIndex - cardsPerPage
    const currentProposal = clientData.slice(firstIndex, lastIndex)
    const totalPages = Math.ceil(clientData.length / cardsPerPage)

    return (
        <div
            className="flex flex-col min-h-screen bg-[#f9fafc]"
            style={{
                background:
                    "url('/Images/background_img.svg') #f9fafc center / cover no-repeat fixed",
            }}
        >
            <Sidebar />

            <div className="flex-1 px-10 py-8 max-w-[1591px] w-full mx-auto">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-[28px] font-semibold text-[#3f4050] tracking-wide">
                        Clients
                    </h1>
                </div>

                {/* Search Section */}
                <div className="flex flex-wrap items-end gap-6 p-8 bg-white rounded-2xl shadow-[0_4px_8px_rgba(214,214,214,0.4)] mb-8">

                    <div className="flex flex-col gap-2 flex-1 min-w-[220px]">
                        <label className="text-sm font-medium text-[#555665]">
                            Search
                        </label>

                        <input
                            type="text"
                            placeholder="Search clients"
                            className="px-4 py-3 rounded-lg border-2 border-[#d9dce8] outline-none focus:border-[#576aff]"
                        />
                    </div>

                </div>

                <h2 className="text-xl font-semibold mb-5">
                    Client List
                </h2>

                {/* Cards */}

                <div className="grid grid-cols-4 gap-7 max-[1280px]:grid-cols-3 max-[1024px]:grid-cols-2 max-[640px]:grid-cols-1">

                    {currentProposal.map((item) => (
                        <div key={item.id} className="group relative p-7 bg-white rounded-2xl border border-[#f0f0f3] shadow-[0_2px_6px_rgba(214,214,214,0.3)] hover:shadow-[0_8px_20px_rgba(87,106,255,0.12)] hover:-translate-y-0.5 transition-all duration-200">

                            <button className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full text-[#818293] hover:bg-[#f5f7ff] hover:text-[#576aff] transition-colors">
                                <HiDotsVertical size={18} />
                            </button>

                            <div className="flex items-center gap-3 mb-5 pr-8">
                                <div className={`w-12 h-12 shrink-0 rounded-full bg-gradient-to-br ${getAvatarColor(item.id)} text-white flex items-center justify-center font-semibold text-sm shadow-sm`}>
                                    {item.name?.charAt(0).toUpperCase()}
                                </div>

                                <div className="min-w-0">
                                    <h3 className="font-semibold text-[#1e1e21] leading-snug truncate">
                                        {item.name}
                                    </h3>
                                    <p className="text-xs text-[#9698a6] truncate">
                                        {item.email}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2.5 mb-5">
                                <div className="flex items-center gap-2.5">
                                    <FiMail className="text-[#9698a6] shrink-0" size={14} />
                                    <span className="text-sm text-[#555665] truncate">{item.email}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#f9fafc] mb-5">
                                <span className="text-sm font-medium text-[#555665]">Proposals</span>
                                <span className="text-sm font-semibold text-[#576aff]">{item.proposal_count}</span>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-[#f0f0f3]">
                                <button
                                    onClick={() => {
                                        setSelectedClient(item)
                                        setShowModal(true)
                                    }}
                                    className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-[#eef0ff] text-[#576aff] border border-[#cfd6ff] hover:bg-blue-700 hover:text-white transition-colors cursor-pointer"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => setConfirmDeleteId(item.id)}
                                    className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-[#fff1f1] text-red-500 border border-red-200 hover:bg-red-700 hover:text-white transition-colors cursor-pointer"
                                >
                                    Delete
                                </button>
                            </div>

                        </div>
                    ))}

                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-10">

                    <div className="px-4 py-2 bg-white border border-[#e7e7eb] rounded-lg text-sm text-[#555665] shadow-sm">
                        Showing{" "}
                        <span className="font-semibold">{clientData.length ? firstIndex + 1 : 0}</span>{" "}
                        to{" "}
                        <span className="font-semibold">
                            {Math.min(lastIndex, clientData.length)}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold">{clientData.length}</span>{" "}
                        Entries
                    </div>

                    <div className="flex items-center gap-2">

                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#d9dce8] bg-white disabled:opacity-50 hover:bg-[#f5f7ff]"
                        >
                            &#10094;
                        </button>

                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`w-10 h-10 rounded-lg text-sm font-medium transition
                                    ${currentPage === index + 1
                                        ? "bg-[#576aff] text-white"
                                        : "bg-white border border-[#d9dce8] text-[#555665] hover:bg-[#f5f7ff]"
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#d9dce8] bg-white disabled:opacity-50 hover:bg-[#f5f7ff]"
                        >
                            &#10095;
                        </button>

                    </div>

                </div>

            </div>

            {/* Edit Client Modal */}
            {showModal && (
                <EditClientModal
                    client={selectedClient}
                    onClose={() => {
                        setShowModal(false)
                        setSelectedClient(null)
                    }}
                    getClient={getClient}
                />
            )}

            {/* Delete Confirmation Popup */}
            {confirmDeleteId && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999]">
                    <div className="bg-white rounded-[16px] shadow-lg w-[360px] p-6">
                        <h3 className="text-lg font-semibold text-[#1e1e21] mb-2">
                            Delete client?
                        </h3>
                        <p className="text-sm text-[#555665] mb-6">
                            Are you sure you want to delete this client? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-4 py-2 text-sm font-medium text-[#555665] border-2 border-[#d9dce8] rounded-[8px] hover:bg-[#f9fafc] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(confirmDeleteId)}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-[8px] hover:bg-red-600 transition-colors"
                            >
                                Yes, delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AddClient;