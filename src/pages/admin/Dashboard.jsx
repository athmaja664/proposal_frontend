import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import { listProposalAPI } from "../../../services/allAPI";
import { IoFileTrayFull } from "react-icons/io5";
import { FcAcceptDatabase } from "react-icons/fc";
import { HiPresentationChartLine } from "react-icons/hi";
import { MdOutlineSmsFailed } from "react-icons/md";
import { HiOutlineNoSymbol } from "react-icons/hi2";
import Spinner from "../../components/Spinner";
function Dashboard() {
    const navigate = useNavigate()
    const [searchInput, setSearchInput] = useState("");
    const [statusInput, setStatusInput] = useState("All Status");
    const [dateInput, setDateInput] = useState("");
    const [logs, setLogs] = useState([])
    const [proposalData, setProposalData] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("All Status")
    const [filterDate, setFilterDate] = useState('')
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
    useEffect(() => {
        getProposals()
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
                                    <input
                                        type="text"
                                        placeholder="Search Project / Client Name"
                                        className="px-4 py-2 rounded-[8px] border-2 border-[#d9dce8] text-sm text-[#3f4050] focus:outline-none"

                                        onChange={(e) => setSearchInput(e.target.value)}
                                    />

                                </div>

                                {/* <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[#555665]">Client Name</label>
        <input
            type="text"
            placeholder="Search Client Name"
            className="px-4 py-2 rounded-[8px] border border-[#e7e7eb] text-sm text-[#3f4050] focus:outline-none"
        />
    </div> */}

                                <div className="flex gap-6">

                                    <div className="flex flex-col gap-2 w-1/2">
                                        <label className="text-sm font-medium text-[#555665]">
                                            Proposal Add Date
                                        </label>

                                        <input
                                            type="date"
                                            className="w-full px-4 py-2 rounded-[8px] border-2 border-[#d9dce8] text-sm"
                                            onChange={(e) => setDateInput(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2 w-1/2">
                                        <label className="text-sm font-medium text-[#555665]">
                                            Status
                                        </label>

                                        <select className="w-full px-4 py-2 rounded-[8px] border-2 border-[#d9dce8] text-sm"
                                            onChange={(e) => setStatusInput(e.target.value)}>
                                            <option>All Status</option>
                                            <option>Draft</option>
                                            <option>Sent</option>
                                            <option>Accepted</option>
                                            <option>Rejected</option>
                                        </select>
                                    </div>

                                </div>



                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        className="flex-1 px-5 py-2 rounded-[8px] border-2 border-[#d9dce8] text-sm font-medium text-[#555665] hover:bg-[#f9fafc]"
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
                                        }}
                                    >
                                        Clear
                                    </button>
                                    <button
                                        type="button"
                                        className="flex-1 px-5 py-2 rounded-[8px] text-sm font-medium text-white bg-[#576aff] rounded-[4px] no-underline hover:bg-[#3d52f2] transition-colors whitespace-nowrap" onClick={() => {
                                            setSearch(searchInput);
                                            setStatusFilter(statusInput);
                                            setFilterDate(dateInput);
                                            setCurrentPage(1);
                                        }}
                                    >
                                        Filter
                                    </button>

                                </div>

                            </div>
                            {currentProposal.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col items-start gap-[14px] p-8 bg-white rounded-[16px] shadow-[0_4px_8px_0_rgba(214,214,214,0.25)]"
                                >
                                    <h3 className="text-lg font-semibold text-black">{item.project_name}</h3>

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

                </div>
            </div>
        </>
    );
}

export default Dashboard;
