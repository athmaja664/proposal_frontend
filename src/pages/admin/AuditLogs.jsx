import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../../components/Sidebar";
import { clearEmptyLogsAPI, getAuditLogsAPI } from "../../../services/allAPI";
import Spinner from "../../components/Spinner";
import toast, { Toaster } from 'react-hot-toast'
function AuditLogs() {
    const [logs, setLogs] = useState([])
    const [searchKey, setSearchKey] = useState('')
    const [filterPerformedBy, setFilterPerformedBy] = useState('All')
    const [filterAction, setFilterAction] = useState('All')
    const [filterDate, setFilterDate] = useState('')
    //spinner
    const [loading, setLoading] = useState(true)
    const token = localStorage.getItem('token')
    // controls the custom "Clear Empty Logs" confirmation popup
    const [showClearConfirm, setShowClearConfirm] = useState(false)
    //autofill
    const [showSuggestions, setShowSuggestions] = useState(false)
    const searchBoxRef = useRef(null)
    
    //cursor-status 
    const [showPerformedByDropdown, setShowPerformedByDropdown] = useState(false)
    const performedByDropdownRef = useRef(null)
    const [showActionDropdown, setShowActionDropdown] = useState(false)
    const actionDropdownRef = useRef(null)
    //pagination
    const [currentPage, setCurrentPage] = useState(1)
    const logsPerPage = 10

    const getLogs = async () => {
        const reqHeader = { Authorization: `Bearer ${token}` }
        const response = await getAuditLogsAPI(reqHeader)
        if (response.status === 200) {
            setLogs(response.data)
        }
        setLoading(false)
    }

    useEffect(() => {
        getLogs()
    }, [])

    const searchSuggestions = searchKey
        ? [...new Set(
            logs.flatMap((log) => [log.client_name, log.project_name])
        )].filter((name) =>
            name && name.toLowerCase().includes(searchKey.toLowerCase())
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

    const getActionStyle = (action) => {
        if (action === 'proposal_created') return 'bg-blue-100 text-blue-700'
        if (action === 'link_generated') return 'bg-yellow-100 text-yellow-700'
        if (action === 'link_revoked') return 'bg-red-100 text-red-700'
        if (action === 'link_unrevoked') return 'bg-green-100 text-green-700'
        if (action === 'client_accessed') return 'bg-purple-100 text-purple-700'
        if (action === 'signature_submitted') return 'bg-green-100 text-green-700'
        return 'bg-gray-100 text-gray-700'
    }
   
const performedByOptions = [
    { value: 'All', label: 'All Users' },
    { value: 'admin', label: 'Admin' },
    { value: 'client', label: 'Client' },
]

const actionOptions = [
    { value: 'All', label: 'All Actions' },
    { value: 'proposal_created', label: 'Proposal Created' },
    { value: 'link_generated', label: 'Link Generated' },
    { value: 'link_revoked', label: 'Link Revoked' },
    { value: 'link_unrevoked', label: 'Link Unrevoked' },
    { value: 'client_accessed', label: 'Client Accessed' },
    { value: 'signature_submitted', label: 'Signature Submitted' },
]
    const filteredLogs = logs.filter((log) => {
        const matchSearch =
            log.client_name?.toLowerCase().includes(searchKey.toLowerCase()) ||
            log.project_name?.toLowerCase().includes(searchKey.toLowerCase()) ||
            searchKey === ''

        const matchPerformedBy =
            filterPerformedBy === 'All' ||
            log.performed_by?.toLowerCase() === filterPerformedBy.toLowerCase()

        const matchAction =
            filterAction === 'All' ||
            log.action === filterAction

        const matchDate =
            filterDate === '' ||
            new Date(log.created_at).toLocaleDateString() ===
            new Date(filterDate).toLocaleDateString()

        return matchSearch && matchPerformedBy && matchAction && matchDate
    })

    //pagination calculations
    const lastIndex = currentPage * logsPerPage;
    const firstIndex = lastIndex - logsPerPage;
    const currentLogs = filteredLogs.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

    //reset to page 1 whenever any filter changes
    useEffect(() => {
        setCurrentPage(1)
    }, [searchKey, filterPerformedBy, filterAction, filterDate])

    
    const getPageNumbers = () => {
        const pages = []
        const delta = 1 // how many neighbours to show around current page

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - delta && i <= currentPage + delta)
            ) {
                pages.push(i)
            } else if (pages[pages.length - 1] !== '...') {
                pages.push('...')
            }
        }
        return pages
    }
    
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (performedByDropdownRef.current && !performedByDropdownRef.current.contains(e.target)) {
                setShowPerformedByDropdown(false)
            }
            if (actionDropdownRef.current && !actionDropdownRef.current.contains(e.target)) {
                setShowActionDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleClearEmpty = async () => {
        setShowClearConfirm(true)
    }

    const confirmClearEmpty = async () => {
        const reqHeader = { Authorization: `Bearer ${token}` }
        const response = await clearEmptyLogsAPI(reqHeader)
        if (response.status === 200) {
            toast.success('Cleared!')
            getLogs() // refresh
        }
        setShowClearConfirm(false)
    }
    if (loading) return <Spinner />
    return (
        <div
            className="flex flex-col min-h-screen bg-[#f9fafc]"
            style={{ background: "url('/Images/background_img.svg') #f9fafc center / cover no-repeat fixed" }}
        >
            <Toaster position="top-center" />
            <Sidebar />

            <div className="flex-1 px-10 py-8 max-w-[1591px] w-full mx-auto">

                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-[28px] font-semibold text-[#3f4050] tracking-wide">
                        Audit Logs
                    </h1>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-end gap-6 p-8 bg-white rounded-[16px] shadow-[0_4px_8px_0_rgba(214,214,214,0.4)] mb-8">
                    <div className="flex flex-col gap-2 flex-1 min-w-[220px]">
                        <label className="text-sm font-medium text-[#555665]">Search</label>
                        <div className="relative" ref={searchBoxRef}>
                            <input
                                type="text"
                                placeholder="Search by client or project"
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


<div className="flex flex-col gap-2 min-w-[180px]">
    <label className="text-sm font-medium text-[#555665]">Performed By</label>
    <div className="relative" ref={performedByDropdownRef}>
        <button
            type="button"
            onClick={() => setShowPerformedByDropdown(!showPerformedByDropdown)}
            className="w-full px-4 py-3 rounded-[8px] border-2 border-[#d9dce8] text-sm text-[#3f4050] outline-none focus:border-[#576aff] cursor-pointer bg-white flex justify-between items-center"
        >
            {performedByOptions.find(o => o.value === filterPerformedBy)?.label}
            <span className="text-[#818293]">▾</span>
        </button>
        {showPerformedByDropdown && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-lg shadow-lg border border-[#e7e7eb] z-20 overflow-hidden">
                {performedByOptions.map((opt) => (
                    <div
                        key={opt.value}
                        onClick={() => {
                            setFilterPerformedBy(opt.value)
                            setShowPerformedByDropdown(false)
                        }}
                        className="px-4 py-2 text-sm cursor-pointer hover:bg-[#f5f7ff]"
                    >
                        {opt.label}
                    </div>
                ))}
            </div>
        )}
    </div>
</div>

<div className="flex flex-col gap-2 min-w-[220px]">
    <label className="text-sm font-medium text-[#555665]">Action</label>
    <div className="relative" ref={actionDropdownRef}>
        <button
            type="button"
            onClick={() => setShowActionDropdown(!showActionDropdown)}
            className="w-full px-4 py-3 rounded-[8px] border-2 border-[#d9dce8] text-sm text-[#3f4050] outline-none focus:border-[#576aff] cursor-pointer bg-white flex justify-between items-center"
        >
            {actionOptions.find(o => o.value === filterAction)?.label}
            <span className="text-[#818293]">▾</span>
        </button>
        {showActionDropdown && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-lg shadow-lg border border-[#e7e7eb] z-20 overflow-hidden max-h-60 overflow-y-auto">
                {actionOptions.map((opt) => (
                    <div
                        key={opt.value}
                        onClick={() => {
                            setFilterAction(opt.value)
                            setShowActionDropdown(false)
                        }}
                        className="px-4 py-2 text-sm cursor-pointer hover:bg-[#f5f7ff]"
                    >
                        {opt.label}
                    </div>
                ))}
            </div>
        )}
    </div>
</div>

                    <div className="flex flex-col gap-2 min-w-[180px]">
                        <label className="text-sm font-medium text-[#555665]">Date</label>
                        <input
                            type="date"
                            className="px-4 py-3 rounded-[8px] border-2 border-[#d9dce8] text-sm text-[#3f4050] outline-none focus:border-[#576aff]"
                            onChange={(e) => setFilterDate(e.target.value)}
                        />
                    </div>

                    {/* Clear Empty Logs Button */}
                    <button
                        onClick={handleClearEmpty}
                        className="px-5 py-3 rounded-[8px] border-2 border-[#d9dce8] text-sm font-medium text-[#555665] hover:bg-[#f9fafc] cursor-pointer"
                    >
                        Clear Empty Logs
                    </button>
                </div>

                <h2 className="text-xl font-semibold text-black mb-5">
                    Activity
                </h2>

                {/* Table */}
                <div className="bg-white rounded-[16px] shadow-[0_4px_8px_0_rgba(214,214,214,0.4)] overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-[#f9fafc] border-b border-[#e7e7eb] text-[#555665]">
                            <tr>
                                <th className="text-left px-6 py-4 font-semibold">Action</th>
                                <th className="text-left px-6 py-4 font-semibold">Client</th>
                                <th className="text-left px-6 py-4 font-semibold">Project</th>
                                <th className="text-left px-6 py-4 font-semibold">Performed By</th>
                                <th className="text-left px-6 py-4 font-semibold">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentLogs.length ? currentLogs.map((log) => (
                                <tr key={log.id} className="border-b border-[#e7e7eb] hover:bg-[#f9fafc]">
                                    <td className="px-6 py-4">
                                        <span className={`${getActionStyle(log.action)} text-xs font-medium px-3 py-1 rounded-full`}>
                                            {log.action.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-[#818293]">
                                        {log.client_name}
                                    </td>
                                    <td className="px-6 py-4 text-[#818293]">
                                        {log.project_name}
                                    </td>
                                    <td className="px-6 py-4 text-[#818293]">
                                        {log.performed_by}
                                    </td>
                                    <td className="px-6 py-4 text-[#818293]">
                                        {new Date(log.created_at).toLocaleString()}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-10 text-[#9698a6]">
                                        No logs found
                                    </td>
                                </tr>
                            )}

                        </tbody>
                    </table>
                </div>

                {/* pagination */}
                {filteredLogs.length > 0 && (
                    <div className="flex items-center justify-between mt-10">

                        {/* Left Side */}
                        <div className="px-4 py-2 bg-white border border-[#e7e7eb] rounded-lg text-sm text-[#555665] shadow-sm">
                            Showing{" "}
                            <span className="font-semibold">{firstIndex + 1}</span>{" "}
                            to{" "}
                            <span className="font-semibold">
                                {Math.min(lastIndex, filteredLogs.length)}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold">{filteredLogs.length}</span>{" "}
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

                            {getPageNumbers().map((page, index) =>
                                page === '...' ? (
                                    <span
                                        key={`dots-${index}`}
                                        className="w-10 h-10 flex items-center justify-center text-sm text-[#818293] select-none"
                                    >
                                        &#8230;
                                    </span>
                                ) : (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-10 h-10 rounded-lg text-sm font-medium transition cursor-pointer
          ${currentPage === page
                                                ? "bg-[#576aff] text-white"
                                                : "bg-white border border-[#d9dce8] text-[#555665] hover:bg-[#f5f7ff] cursor-pointer"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                )
                            )}

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

            {showClearConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-sm bg-white rounded-[16px] shadow-xl p-8 flex flex-col items-center gap-5 text-center">
                        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                            <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
                                <path d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0-1 12a2 2 0 01-2 2H9a2 2 0 01-2-2L6 7h12z"
                                    stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-[#3f4050] mb-1">Clear Empty Logs</h3>
                            <p className="text-sm text-[#818293]">Are you sure you want to delete all logs with missing proposal data? This action cannot be undone.</p>
                        </div>
                        <div className="flex gap-3 w-full mt-2">
                            <button
                                type="button"
                                onClick={() => setShowClearConfirm(false)}
                                className="flex-1 px-5 py-2.5 rounded-[8px] border-2 border-[#d9dce8] text-sm font-medium text-[#555665] hover:bg-[#f9fafc] cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmClearEmpty}
                                className="flex-1 px-5 py-2.5 rounded-[8px] text-sm font-medium text-white bg-blue-500 hover:bg-red-600 transition-colors cursor-pointer"
                            >
                                Yes, clear
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AuditLogs