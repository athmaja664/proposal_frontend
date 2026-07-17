import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../../components/Sidebar";
import { deleteProposalAPI, listProposalAPI } from "../../../services/allAPI";
import EditProposalModal from "../../components/EditProposalModal";
//import ViewProposalModal from "../../components/ViewProposalModal";
import GenerateLinkModal from "../../components/GenerateLinkModal";
import Spinner from "../../components/Spinner";
import toast, { Toaster } from 'react-hot-toast'
import { HiDotsVertical } from "react-icons/hi"
import { useNavigate } from "react-router-dom";
function Proposals() {
    const navigate = useNavigate();
    //editmodal
    const [showModal, setShowModal] = useState(false)
    //viewmodal
    //const [showViewModal, setShowViewModal] = useState(false)
    const [searchKey, setSearchKey] = useState("")
    const [statusFilter, setStatusFilter] = useState("All Status")
    //get
    const [proposals, setProposals] = useState([])
    //edit/view
    const [selectedProposal, setSelectedProposal] = useState(null)
    //generate link
    const [showLinkModal, setShowLinkModal] = useState(false)
    const [selectedProposalId, setSelectedProposalId] = useState('')
    //spinnner
    const [loading, setLoading] = useState(true)
    const token = localStorage.getItem('token')
    //dlt notf
    const [confirmDeleteId, setConfirmDeleteId] = useState(null)
    // action menu toggle (UI only — which card's action dropdown is open)
    const [openActionId, setOpenActionId] = useState(null)
    // ref for the currently open action dropdown, used to detect outside clicks
    const actionRef = useRef(null)
    //pagination
    const [currentPage, setCurrentPage] = useState(1)
    const cardsPerPage = 8

    const getProposals = async () => {
        const reqHeader = { Authorization: `Bearer ${token}` }
        const response = await listProposalAPI(reqHeader)
        if (response.status === 200) {
            setProposals(response.data)
            console.log("Proposal Component Loaded");
        }
        setLoading(false)
    }


    const handleDelete = async (id) => {
        const reqHeader = { Authorization: `Bearer ${token}` }

        const response = await deleteProposalAPI(id, reqHeader)

        if (response.status === 200) {
            setConfirmDeleteId(null)
            toast.success('Proposal deleted successfully')
            getProposals()
        } else {
            toast.error('Failed to delete proposal')
        }
    }

    useEffect(() => {
        getProposals()
    }, [])
    const filterProposal = proposals.filter((item) =>
        (
            item.project_name.toLowerCase().includes(searchKey.toLowerCase()) ||
            item.client_name.toLowerCase().includes(searchKey.toLowerCase())
        )
        &&
        (
            statusFilter === "All Status" ||
            item.status === statusFilter
        )
    )

    //pagination calculations
    const lastIndex = currentPage * cardsPerPage;
    const firstIndex = lastIndex - cardsPerPage;
    const currentProposal = filterProposal.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(filterProposal.length / cardsPerPage);

    //reset to page 1 when search changes
    useEffect(() => {
        setCurrentPage(1)
    }, [searchKey])

    //reset to page 1 when status filter changes
    useEffect(() => {
        setCurrentPage(1)
    }, [statusFilter])

    //close action dropdown when clicking anywhere outside it
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (actionRef.current && !actionRef.current.contains(e.target)) {
                setOpenActionId(null)
            }
        }
        if (openActionId !== null) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [openActionId])

    const getStatusStyle = (status) => {
        if (status === 'Accepted') return 'bg-blue-100 text-blue-700 border border-blue-200'
        if (status === 'Sent') return 'bg-[#bcefb0] text-[#3d6b35] border border-[#a7d59d]'
        if (status === 'Draft') return 'bg-[#fdf17b] text-[#847b2c] border border-[#efe478]'
        if (status === 'Rejected') return 'bg-red-100 text-red-700 border border-red-200'
        if (status === 'Archived') return 'bg-gray-200 text-gray-700 border border-gray-300'
    }
    if (loading) return <Spinner />
    return (
        <>
            <div
                className="flex flex-col min-h-screen bg-[#f9fafc]"
                style={{ background: "url('/Images/background_img.svg') #f9fafc center / cover no-repeat fixed" }}
            >
                <Toaster position="top-center" />
                <Sidebar />

                <div className="flex-1 px-10 py-8 max-w-[1591px] w-full mx-auto">

                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-[28px] font-semibold text-[#3f4050] tracking-wide">
                            Proposals
                        </h1>
                    </div>

                    {/* filter panel */}
                    <div className="flex flex-wrap items-end gap-6 p-8 bg-white rounded-[16px] shadow-[0_4px_8px_0_rgba(214,214,214,0.4)] mb-8">
                        <div className="flex flex-col gap-2 flex-1 min-w-[220px]">
                            <label className="text-sm font-medium text-[#555665]">Search</label>
                            <input
                                type="text"
                                placeholder="Search proposals"
                                className="px-4 py-3 rounded-[8px] border-2 border-[#d9dce8] text-sm text-[#3f4050] outline-none focus:border-[#576aff]"
                                onChange={(e) => setSearchKey(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2 min-w-[200px]">
                            <label className="text-sm font-medium text-[#555665]">Status</label>
                            <select
                                className="px-4 py-3 rounded-[8px] border-2 border-[#d9dce8] text-sm text-[#3f4050] outline-none focus:border-[#576aff]"
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option>All Status</option>
                                <option>Draft</option>
                                <option>Sent</option>
                                <option>Accepted</option>
                                <option>Rejected</option>
                            </select>
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold text-black mb-5">
                        Proposals List
                    </h2>

                    {/* proposal cards */}
                    {filterProposal.length ? (
                        <div className="grid grid-cols-4 gap-[29px] max-[1280px]:grid-cols-3 max-[1024px]:grid-cols-2 max-[640px]:grid-cols-1">
                            {currentProposal.map((item) => (
                                <div
                                    key={item.id}
                                    ref={openActionId === item.id ? actionRef : null}
                                    className="relative flex flex-col items-start gap-[14px] p-8 bg-white rounded-[16px] shadow-[0_4px_8px_0_rgba(214,214,214,0.25)]"
                                >
                                    <h3 className="text-lg font-semibold text-black pr-6">{item.project_name}</h3>

                                    <dl className="flex flex-col gap-5 w-full">
                                        <div className="flex flex-col gap-1">
                                            <dt className="text-sm font-medium text-[#555665]">Client Name:</dt>
                                            <dd className="text-sm text-[#818293]">{item.client_name}</dd>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <dt className="text-sm font-medium text-[#555665]">Proposal Ad Date:</dt>
                                            <dd className="text-sm text-[#818293]">{item.created_at.slice(0, 10)}</dd>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <dt className="text-sm font-medium text-[#555665]">Status</dt>
                                            <dd>
                                                <span className={`${getStatusStyle(item.status)} inline-flex justify-center items-center px-[10px] py-[10px] text-sm font-medium rounded-[5px]`}>
                                                    {item.status}
                                                </span>
                                            </dd>
                                        </div>
                                    </dl>

                                    {/* action trigger */}
                                    <button
                                        type="button"
                                        onClick={() => setOpenActionId(openActionId === item.id ? null : item.id)}
                                        className="absolute top-8 right-8 w-8 h-8 flex items-center justify-center rounded-full text-[#818293] hover:bg-[#f5f7ff] hover:text-[#576aff] transition-colors cursor-pointer"
                                        aria-label="Actions"
                                    >
                                        <HiDotsVertical size={18} />
                                    </button>

                                    {openActionId === item.id && (
                                        <div className="absolute top-16 right-8 z-10 w-40 bg-white rounded-lg shadow-lg border border-[#e7e7eb] py-2">
                                            <span
                                                onClick={() => {
                                                    navigate("/viewproposals", {
                                                        state: {
                                                            proposal: item
                                                        }
                                                    });
                                                    setOpenActionId(null);
                                                }}
                                                className="block px-4 py-2 text-sm text-[#576aff] cursor-pointer hover:bg-[#f5f7ff]"
                                            >
                                                View
                                            </span>
                                            <span
                                                onClick={() => {
                                                    setSelectedProposal(item)
                                                    setShowModal(true)
                                                    setOpenActionId(null)
                                                }}
                                                className="block px-4 py-2 text-sm text-[#555665] cursor-pointer hover:bg-[#f5f7ff]"
                                            >
                                                Edit
                                            </span>
                                            <span
                                                onClick={() => {
                                                    setSelectedProposalId(item.id)
                                                    setSelectedProposal(item)
                                                    setShowLinkModal(true)
                                                    setOpenActionId(null)
                                                }}
                                                className="block px-4 py-2 text-sm text-[#3d6b35] cursor-pointer hover:bg-[#f5f7ff]"
                                            >
                                                Generate Link
                                            </span>

                                            <span
                                                onClick={() => {
                                                    setConfirmDeleteId(item.id)
                                                    setOpenActionId(null)
                                                }}
                                                className="block px-4 py-2 text-sm text-red-500 cursor-pointer hover:bg-[#f5f7ff]"
                                            >
                                                Delete
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-[#9698a6] bg-white rounded-[16px] shadow-[0_4px_8px_0_rgba(214,214,214,0.25)] py-14">
                            <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
                                <path d="M9 12h6M9 16h6M9 8h3M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
                                    stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            <p className="text-sm font-medium text-[#555665]">No proposals found</p>
                            <p className="text-xs">Create your first proposal to get started</p>
                        </div>
                    )}

                    {/* pagination */}
                    {filterProposal.length > 0 && (
                        <div className="flex items-center justify-between mt-10">

                            {/* Left Side */}
                            <div className="px-4 py-2 bg-white border border-[#e7e7eb] rounded-lg text-sm text-[#555665] shadow-sm">
                                Showing{" "}
                                <span className="font-semibold">{firstIndex + 1}</span>{" "}
                                to{" "}
                                <span className="font-semibold">
                                    {Math.min(lastIndex, filterProposal.length)}
                                </span>{" "}
                                of{" "}
                                <span className="font-semibold">{filterProposal.length}</span>{" "}
                                Entries
                            </div>

                            {/* Right Side */}
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
                    )}

                </div>
            </div>

            {confirmDeleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px] px-4">
                    <div
                        className="w-full max-w-sm rounded-[16px] p-8 flex flex-col items-center gap-5 text-center shadow-[0_4px_8px_rgba(214,214,214,0.4)]"
                        style={{
                            background:
                                "url('/Images/background_img.svg') #ffffff center / cover no-repeat",
                        }}
                    >
                        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                            <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
                                <path d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0-1 12a2 2 0 01-2 2H9a2 2 0 01-2-2L6 7h12z"
                                    stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-[#3f4050] mb-1">Delete Proposal</h3>
                            <p className="text-sm text-[#818293]">Deleting this proposal will permanently remove it.

                                This action cannot be undone.</p>
                        </div>
                        <div className="flex gap-3 w-full mt-2">
                            <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="flex-1 px-5 py-2.5 rounded-[8px] border-2 border-[#d9dce8] text-sm font-medium text-[#555665] hover:bg-[#f9fafc] cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDelete(confirmDeleteId)}
                                className="flex-1 px-5 py-2.5 rounded-[8px] text-sm font-medium text-white bg-[#576aff] hover:bg-[#4356f2] transition-colors cursor-pointer"
                            >
                                Yes, delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showModal && (
                <EditProposalModal
                    onClose={() => setShowModal(false)}
                    proposal={selectedProposal}
                    getProposals={getProposals}
                />
            )}

            

            {showLinkModal && (
                <GenerateLinkModal
                    proposalId={selectedProposalId}
                    proposalStatus={selectedProposal?.status}
                    proposal={selectedProposal}
                    onClose={() => {
                        setShowLinkModal(false)
                        getProposals()
                    }}

                />
            )}
        </>
    );
}

export default Proposals;