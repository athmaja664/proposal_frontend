import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../../components/Sidebar";
import { deleteProposalAPI, listProposalAPI, genereteProposalStatusAPI } from "../../../services/allAPI";
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
    const [filterDate, setFilterDate] = useState("")
    const [showSuggestions, setShowSuggestions] = useState(false)
    const searchBoxRef = useRef(null)
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
   //cursor-status
   const [showStatusDropdown, setShowStatusDropdown] = useState(false)
    const statusDropdownRef = useRef(null)
    //pagination
    const [currentPage, setCurrentPage] = useState(1)
    const cardsPerPage = 8
    const [statuses, setStatuses] = useState([])

    const getStatuses = async () => {
        const reqHeader = { Authorization: `Bearer ${token}` }
        const response = await genereteProposalStatusAPI(reqHeader)
        if (response.status === 200) {
            setStatuses(response.data)
        }
    }

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
        getStatuses()
    }, [])
    const filterProposal = proposals.filter((item) =>
        (
            item.project_name.toLowerCase().includes(searchKey.toLowerCase()) ||
            item.client_name.toLowerCase().includes(searchKey.toLowerCase())
        )
        &&
        (
            statusFilter === "All Status" ||
            item.status_name === statusFilter
        )
        &&
        (
            filterDate === "" ||
            item.created_at.slice(0, 10) === filterDate
        )
    )

    // build unique client/project name suggestions matching the typed search text
    const searchSuggestions = searchKey
        ? [...new Set(
            proposals.flatMap((item) => [item.client_name, item.project_name])
        )].filter((name) =>
            name && name.toLowerCase().includes(searchKey.toLowerCase())
        ).slice(0, 6)
        : []

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

    //reset to page 1 when date filter changes
    useEffect(() => {
        setCurrentPage(1)
    }, [filterDate])

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

    //close search suggestions when clicking outside the search box
    useEffect(() => {
        const handleClickOutsideSearch = (e) => {
            if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
                setShowSuggestions(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutsideSearch)
        return () => {
            document.removeEventListener('mousedown', handleClickOutsideSearch)
        }
    }, [])

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

                <div className="flex-1 px-4 sm:px-6 lg:px-10 py-8 max-w-[1591px] w-full mx-auto">

                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl sm:text-[28px] font-semibold text-[#3f4050] tracking-wide">
                            Proposals
                        </h1>
                    </div>

                    {/* filter panel */}
                    <div className="flex flex-wrap items-end gap-4 sm:gap-6 p-5 sm:p-6 lg:p-8 bg-white rounded-[16px] shadow-[0_4px_8px_0_rgba(214,214,214,0.4)] mb-8">
                        <div className="flex flex-col gap-2 flex-1 min-w-[100%] sm:min-w-[220px]">
                            <label className="text-sm font-medium text-[#555665]">Search</label>
                            <div className="relative" ref={searchBoxRef}>
                                <input
                                    type="text"
                                    placeholder="Search proposals/Clients"
                                    value={searchKey}
                                    className="w-full px-4 py-3 pr-10 rounded-[8px] border-2 border-[#d9dce8] text-sm text-[#3f4050] outline-none focus:border-[#576aff]"
                                    onChange={(e) => {
                                        setSearchKey(e.target.value)
                                        setShowSuggestions(true)
                                    }}
                                    onFocus={() => setShowSuggestions(true)}
                                />
                                {searchKey && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchKey("")
                                            setShowSuggestions(false)
                                        }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9698a6] hover:text-[#555665] cursor-pointer text-lg leading-none"
                                        aria-label="Clear search"
                                    >
                                        &times;
                                    </button>
                                )}
                                {showSuggestions && searchSuggestions.length > 0 && (
                                    <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-lg shadow-lg border border-[#e7e7eb] z-20 overflow-hidden">
                                        {searchSuggestions.map((name, index) => (
                                            <div
                                                key={index}
                                                onClick={() => {
                                                    setSearchKey(name)
                                                    setShowSuggestions(false)
                                                }}
                                                className="px-4 py-2 text-sm text-[#3f4050] cursor-pointer hover:bg-[#f5f7ff]"
                                            >
                                                {name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 min-w-[calc(50%-8px)] sm:min-w-[180px] flex-1 sm:flex-none">
                            <label className="text-sm font-medium text-[#555665]">Proposal Add Date</label>
                            <input
                                type="date"
                                value={filterDate}
                                className="px-4 py-3 rounded-[8px] border-2 border-[#d9dce8] text-sm text-[#3f4050] outline-none focus:border-[#576aff] cursor-pointer w-full"
                                onChange={(e) => setFilterDate(e.target.value)}
                            />
                        </div>
                        
<div className="flex flex-col gap-2 min-w-[calc(50%-8px)] sm:min-w-[200px] flex-1 sm:flex-none">
    <label className="text-sm font-medium text-[#555665]">Status</label>
    <div className="relative" ref={statusDropdownRef}>
        <button
            type="button"
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            className="w-full px-4 py-3 rounded-[8px] border-2 border-[#d9dce8] text-sm text-[#3f4050] outline-none focus:border-[#576aff] cursor-pointer bg-white flex justify-between items-center"
        >
            {statusFilter}
            <span className="text-[#818293]">▾</span>
        </button>
        {showStatusDropdown && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-lg shadow-lg border border-[#e7e7eb] z-20 overflow-hidden max-h-60 overflow-y-auto">
                <div
                    onClick={() => {
                        setStatusFilter("All Status")
                        setShowStatusDropdown(false)
                    }}
                    className="px-4 py-2 text-sm cursor-pointer hover:bg-[#f5f7ff]"
                >
                    All Status
                </div>
                {statuses.map((status) => (
                    <div
                        key={status.id}
                        onClick={() => {
                            setStatusFilter(status.status_name)
                            setShowStatusDropdown(false)
                        }}
                        className="px-4 py-2 text-sm cursor-pointer hover:bg-[#f5f7ff]"
                    >
                        {status.status_name}
                    </div>
                ))}
            </div>
        )}
    </div>
</div>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <button
                                type="button"
                                className="w-full sm:w-auto px-5 py-3 rounded-[8px] border-2 border-[#d9dce8] text-sm font-medium text-[#555665] hover:bg-[#f9fafc] cursor-pointer"
                                onClick={() => {
                                    setSearchKey("")
                                    setFilterDate("")
                                    setStatusFilter("All Status")
                                    setCurrentPage(1)
                                }}
                            >
                                Clear
                            </button>
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold text-black mb-5">
                        Proposals List
                    </h2>

                    {/* proposal cards */}
                    {filterProposal.length ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-[29px]">
                            {currentProposal.map((item) => (
                                <div
                                    key={item.id}
                                    ref={openActionId === item.id ? actionRef : null}
                                    className="relative flex flex-col items-start gap-[14px] p-5 sm:p-6 lg:p-8 bg-white rounded-[16px] shadow-[0_4px_8px_0_rgba(214,214,214,0.25)]"
                                >
                                    <h3 className="text-lg font-semibold text-black pr-6 break-words">{item.project_name}</h3>

                                    <dl className="flex flex-col gap-5 w-full">
                                        <div className="flex flex-col gap-1">
                                            <dt className="text-sm font-medium text-[#555665]">Client Name:</dt>
                                            <dd className="text-sm text-[#818293] break-words">{item.client_name}</dd>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <dt className="text-sm font-medium text-[#555665]">Proposal Ad Date:</dt>
                                            <dd className="text-sm text-[#818293]">{item.created_at.slice(0, 10)}</dd>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <dt className="text-sm font-medium text-[#555665]">Status</dt>
                                            <dd>
                                                <span className={`${getStatusStyle(item.status_name)} inline-flex justify-center items-center px-[10px] py-[10px] text-sm font-medium rounded-[5px]`}>
                                                    {item.status_name}
                                                </span>
                                            </dd>
                                        </div>
                                    </dl>

                                    {/* action trigger */}
                                    <button
                                        type="button"
                                        onClick={() => setOpenActionId(openActionId === item.id ? null : item.id)}
                                        className="absolute top-5 right-5 sm:top-8 sm:right-8 w-8 h-8 flex items-center justify-center rounded-full text-[#818293] hover:bg-[#f5f7ff] hover:text-[#576aff] transition-colors cursor-pointer"
                                        aria-label="Actions"
                                    >
                                        <HiDotsVertical size={18} />
                                    </button>

                                    {openActionId === item.id && (
                                        <div className="absolute top-14 right-5 sm:top-16 sm:right-8 z-10 w-40 bg-white rounded-lg shadow-lg border border-[#e7e7eb] py-2">
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
                                                className="block px-4 py-2 text-sm text-red-500 cursor-pointer hover:bg-[#f5f7ff] "
                                            >
                                                Delete
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-[#9698a6] bg-white rounded-[16px] shadow-[0_4px_8px_0_rgba(214,214,214,0.25)] py-14 px-4 text-center">
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
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10">

                            {/* Left Side */}
                            <div className="px-4 py-2 bg-white border border-[#e7e7eb] rounded-lg text-sm text-[#555665] shadow-sm text-center sm:text-left">
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
                            <div className="flex flex-wrap items-center justify-center gap-2">

                                  
                                <button
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#d9dce8] bg-white disabled:opacity-50 hover:bg-[#f5f7ff] cursor-pointer disabled:cursor-not-allowed"
                                >
                                    &#10094;
                                </button>

                                {Array.from({ length: totalPages }, (_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentPage(index + 1)}
                                        className={`w-10 h-10 rounded-lg text-sm font-medium transition cursor-pointer
          ${currentPage === index + 1
                                                ? "bg-[#576aff] text-white"
                                                : "bg-white border border-[#d9dce8] text-[#555665] hover:bg-[#f5f7ff] cursor-pointer" 
                                            }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#d9dce8] bg-white disabled:opacity-50 hover:bg-[#f5f7ff] cursor-pointer disabled:cursor-not-allowed"
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
                        className="w-full max-w-sm rounded-[16px] p-6 sm:p-8 flex flex-col items-center gap-5 text-center shadow-[0_4px_8px_rgba(214,214,214,0.4)]"
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