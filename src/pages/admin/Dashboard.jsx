import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../../components/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import { listProposalAPI, genereteProposalStatusAPI, deleteProposalAPI } from "../../../services/allAPI";
import EditProposalModal from "../../components/EditProposalModal";
import GenerateLinkModal from "../../components/GenerateLinkModal";
import { IoFileTrayFull } from "react-icons/io5";
import { FcAcceptDatabase } from "react-icons/fc";
import { HiPresentationChartLine } from "react-icons/hi";
import { MdOutlineSmsFailed } from "react-icons/md";
import { HiOutlineNoSymbol } from "react-icons/hi2";
import { HiDotsVertical } from "react-icons/hi"
import Spinner from "../../components/Spinner";
import toast, { Toaster } from 'react-hot-toast'
function Dashboard() {
    const navigate = useNavigate()
    const [searchInput, setSearchInput] = useState("");
    const [statusInput, setStatusInput] = useState("All Status");
    const [dateInput, setDateInput] = useState("");
    const [logs, setLogs] = useState([])
    const [proposalData, setProposalData] = useState([]);
    const [statuses, setStatuses] = useState([])
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("All Status")
    const [filterDate, setFilterDate] = useState('')
    const [showSuggestions, setShowSuggestions] = useState(false)
    const searchBoxRef = useRef(null)
    //editmodal
    const [showModal, setShowModal] = useState(false)
    const [selectedProposal, setSelectedProposal] = useState(null)
    //generate link
    const [showLinkModal, setShowLinkModal] = useState(false)
    const [selectedProposalId, setSelectedProposalId] = useState('')
    //dlt notf
    const [confirmDeleteId, setConfirmDeleteId] = useState(null)
    // action menu toggle (UI only — which card's action dropdown is open)
    const [openActionId, setOpenActionId] = useState(null)
    // ref for the currently open action dropdown, used to detect outside clicks
    const actionRef = useRef(null)
    const token = localStorage.getItem('token')
     //cursor-status 
    const [showStatusDropdown, setShowStatusDropdown] = useState(false)
    const statusDropdownRef = useRef(null)
    //spinner
    const [loading, setLoading] = useState(true)
    const getProposals = async () => {
        const token = localStorage.getItem('token')
        const reqHeader = { Authorization: `Bearer ${token}` }//crt tokn
        const response = await listProposalAPI(reqHeader)//snt tkn to bc
        if (response.status === 200) {
            setProposalData(response.data)
            console.log("Dashboard Component Loaded");
        }
        setLoading(false)
    }

    // fetch statuses for the filter dropdown
    const getStatuses = async () => {
        const token = localStorage.getItem('token')
        const reqHeader = { Authorization: `Bearer ${token}` }
        const response = await genereteProposalStatusAPI(reqHeader)
        if (response.status === 200) {
            setStatuses(response.data)
        }
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

    
    const searchSuggestions = searchInput
        ? [...new Set(
            proposalData.flatMap((item) => [item.client_name, item.project_name])
        )].filter((name) =>
            name && name.toLowerCase().includes(searchInput.toLowerCase())
        ).slice(0, 6)
        : []

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

    const filterProposal = proposalData.filter((item) => {
        const matchSearch =
            item.project_name.toLowerCase().includes(search.toLowerCase()) ||
            item.client_name.toLowerCase().includes(search.toLowerCase());

        const matchStatus =
            statusFilter === "All Status" ||
            item.status_name === statusFilter;

        const matchDate =
            filterDate === "" ||
            item.created_at.slice(0, 10) === filterDate;

        return matchSearch && matchStatus && matchDate;
    });

    const cardsPerPage = 7
    const lastIndex = currentPage * cardsPerPage;
    const firstIndex = lastIndex - cardsPerPage;
    const currentProposal = filterProposal.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(filterProposal.length / cardsPerPage);
    const totalProposals = proposalData.length
    const acceptedProposals = proposalData.filter((item) => item.status_name === 'Accepted').length
    const sentingProposals = proposalData.filter((item) => item.status_name === 'Sent').length
    const draftProposals = proposalData.filter((item) => item.status_name === 'Draft').length


    const getStatusStyle = (status) => {
        // if (status === 'Accepted') return 'bg-[#bcefb0] text-[#3d6b35] border border-[#a7d59d]'
        if (status === 'Accepted') return 'bg-blue-100 text-blue-700 border border-blue-200'
        if (status === 'Sent') return 'bg-[#bcefb0] text-[#3d6b35] border border-[#a7d59d]'
        // if (status === 'Sent') return 'bg-[#fdf17b] text-[#847b2c] border border-[#efe478]'
        // if (status === 'Draft') return 'bg-[#e7e7eb] text-[#7f84aa] border border-[#cfd3e4]'
        if (status === 'Draft') return 'bg-[#fdf17b] text-[#847b2c] border border-[#efe478]'
        if (status === 'Rejected') return 'bg-red-100 text-red-700 border border-red-200'
        // if (status === 'Archived') return 'bg-blue-100 text-blue-700 border border-blue-200'
    }
    if (loading) return <Spinner />
    return (
        <>
            <div className="flex flex-col min-h-screen bg-[#f9fafc]"
                style={{ background: "url('/Images/background_img.svg') #f9fafc center / cover no-repeat fixed" }}>

                <Toaster position="top-center" />
                <Sidebar />

                <div className="flex-1 px-10 py-8 max-w-[1591px] w-full mx-auto">

                    {/* metrics */}
                    <div className="grid grid-cols-4 gap-[29px] mb-[60px] mt-6 max-[1024px]:grid-cols-2 max-[640px]:grid-cols-1">
                        <div className="flex items-start gap-5 p-8 bg-white rounded-[16px] shadow-[0_4px_8px_0_rgba(214,214,214,0.4)]">
                            <img src="/icons/receipt-edit.svg" alt="total" className="w-12 h-12 hover:opacity-70" />
                            <div>
                                <p className="text-lg font-medium text-[#555665] mb-1">Total Proposals</p>
                                <h2 className="text-[40px] font-semibold leading-[52px] text-[#3f4050]">{totalProposals}</h2>
                                <p className="text-base text-[#555665]">All Proposals</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-5 p-8 bg-white rounded-[16px] shadow-[0_4px_8px_0_rgba(214,214,214,0.4)]">
                            <img src="/icons/right.svg" alt="accept" className="w-12 h-12 hover:opacity-70" />

                            <div>
                                <p className="text-lg font-medium text-[#555665] mb-1">Accepted</p>
                                <h2 className="text-[40px] font-semibold leading-[52px] text-[#3f4050]">{acceptedProposals}</h2>
                                <p className="text-base text-[#555665]">Proposals Accepted</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-5 p-8 bg-white rounded-[16px] shadow-[0_4px_8px_0_rgba(214,214,214,0.4)]">
                            <img src="/icons/user.svg" alt="" className="w-12 h-12 hover:opacity-70" />
                            <div>
                                <p className="text-lg font-medium text-[#555665] mb-1">Sent</p>
                                <h2 className="text-[40px] font-semibold leading-[52px] text-[#3f4050]">{sentingProposals}</h2>
                                <p className="text-base text-[#555665]">Proposals Sent</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-5 p-8 bg-white rounded-[16px] shadow-[0_4px_8px_0_rgba(214,214,214,0.4)]">
                            <img src="/icons/duration.svg" alt="darft" className="w-12 h-12 hover:opacity-70" />
                            <div>
                                <p className="text-lg font-medium text-[#555665] mb-1">Draft</p>
                                <h2 className="text-[40px] font-semibold leading-[52px] text-[#3f4050]">{draftProposals}</h2>
                                <p className="text-base text-[#555665]">Proposals Rejected</p>
                            </div>
                        </div>
                    </div>

                    {/* recent proposals */}

                    <div>

                        <h2 className="text-xl font-semibold text-black mb-5">
                            Proposals
                        </h2>

                        <div className="grid grid-cols-4 gap-[29px] max-[1024px]:grid-cols-2 max-[640px]:grid-cols-1">
                            {/* filter panel */}
                            <div className="flex flex-col justify-between gap-6 p-8 bg-white rounded-[16px] shadow-[0_4px_8px_0_rgba(214,214,214,0.4)] h-full">
                                
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-[#555665]">Project / Client Name</label>
                                    <div className="relative" ref={searchBoxRef}>
                                        <input
                                            type="text"
                                            placeholder="Search Project / Client Name"
                                            value={searchInput}
                                            className="px-4 py-2 pr-10 rounded-[8px] border-2 border-[#d9dce8] text-sm text-[#3f4050] focus:outline-none w-full"
                                            onChange={(e) => {
                                                setSearchInput(e.target.value)
                                                setShowSuggestions(true)
                                            }}
                                            onFocus={() => setShowSuggestions(true)}
                                        />
                                        {showSuggestions && searchSuggestions.length > 0 && (
                                            <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-lg shadow-lg border border-[#e7e7eb] z-20 overflow-hidden">
                                                {searchSuggestions.map((name, index) => (
                                                    <div
                                                        key={index}
                                                        onClick={() => {
                                                            setSearchInput(name)
                                                            setShowSuggestions(false)
                                                        }}
                                                        className="px-4 py-2 text-sm text-[#3f4050] cursor-pointer hover:bg-[#f5f7ff]"
                                                    >
                                                        {name}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    

                                        {searchInput && (
                                            <button
                                                type="button"
                                                onClick={() => setSearchInput("")}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9698a6] hover:text-[#555665] cursor-pointer text-lg leading-none"
                                                aria-label="Clear search"
                                            >
                                                &times;
                                            </button>
                                        )}
                                    </div>
                                </div>


                                <div className="flex gap-6">

                                    <div className="flex flex-col gap-2 w-1/2">
                                        <label className="text-sm font-medium text-[#555665]">
                                            Proposal Add Date
                                        </label>

                                        <input
                                            type="date"
                                            value={dateInput}
                                            className="w-full px-4 py-2 rounded-[8px] border-2 border-[#d9dce8] text-sm cursor-pointer"
                                            onChange={(e) => setDateInput(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2 w-1/2">
                                        <label className="text-sm font-medium text-[#555665]">
                                            Status
                                        </label>

                                     
<div className="relative" ref={statusDropdownRef}>
    <button
        type="button"
        onClick={() => setShowStatusDropdown(!showStatusDropdown)}
        className="w-full px-4 py-2 rounded-[8px] border-2 border-[#d9dce8] text-sm text-left bg-white cursor-pointer flex justify-between items-center"
    >
        {statusInput}
        <span className="text-[#818293]">▾</span>
    </button>
    {showStatusDropdown && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-lg shadow-lg border border-[#e7e7eb] z-20 overflow-hidden max-h-60 overflow-y-auto">
            <div
                onClick={() => {
                    setStatusInput("All Status")
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
                        setStatusInput(status.status_name)
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

                                </div>



                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        className="flex-1 px-5 py-2 rounded-[8px] border-2 border-[#d9dce8] text-sm font-medium text-[#555665] hover:bg-[#f9fafc] cursor-pointer"
                                        onClick={() => {
                                            // Clear input fields
                                            setSearchInput("");
                                            setDateInput("");
                                            setStatusInput("All Status");

                                            // Clear applied filters
                                            setSearch("");
                                            setFilterDate("");
                                            setStatusFilter("All Status");

                                            // Go back to first page
                                            setCurrentPage(1);
                                            setShowSuggestions(false)
                                        }}
                                    >
                                        Clear
                                    </button>
                                    <button
                                        type="button"
                                        className="flex-1 px-5 py-2 rounded-[8px] text-sm font-medium text-white bg-[#576aff] rounded-[4px] no-underline hover:bg-[#3d52f2] transition-colors whitespace-nowrap cursor-pointer" onClick={() => {
                                            setSearch(searchInput);
                                            setStatusFilter(statusInput);
                                            setFilterDate(dateInput);
                                            setCurrentPage(1);
                                            setShowSuggestions(false)
                                        }}
                                    >
                                        Filter
                                    </button>

                                </div>

                            </div>
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
                    </div>

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

export default Dashboard;