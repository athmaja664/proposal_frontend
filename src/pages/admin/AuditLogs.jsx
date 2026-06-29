import React, { useEffect, useState } from "react";
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
    const[loading,setLoading]=useState(true)
    const token = localStorage.getItem('token')

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

    const getActionStyle = (action) => {
        if (action === 'proposal_created') return 'bg-blue-100 text-blue-700'
        if (action === 'link_generated') return 'bg-yellow-100 text-yellow-700'
        if (action === 'link_revoked') return 'bg-red-100 text-red-700'
        if (action === 'link_unrevoked') return 'bg-green-100 text-green-700'
        if (action === 'client_accessed') return 'bg-purple-100 text-purple-700'
        if (action === 'signature_submitted') return 'bg-green-100 text-green-700'
        return 'bg-gray-100 text-gray-700'
    }

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

    const handleClearEmpty = async () => {
    const confirm = window.confirm('Delete all logs with missing proposal data?')
    if (confirm) {
        const reqHeader = { Authorization: `Bearer ${token}` }
        const response = await clearEmptyLogsAPI(reqHeader)
        if (response.status === 200) {
            toast.success('Cleared!')
            getLogs() // refresh
        }
    }
}
if (loading) return <Spinner />
    return (
        <div className="flex min-h-screen bg-blue-50">
             <Toaster position="top-center" />
            <Sidebar />
            <div className="flex-1 p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Audit Logs</h1>

              {/* Filters */}
<div className="flex flex-wrap gap-3 mb-6">
    <input
        type="text"
        placeholder="Search"
        className="border border-gray-300 bg-white px-4 py-2 rounded-lg outline-none text-sm w-52"
        onChange={(e) => setSearchKey(e.target.value)}
    />
    <select
        className="border border-gray-300 bg-white px-4 py-2 rounded-lg outline-none text-sm"
        onChange={(e) => setFilterPerformedBy(e.target.value)}
    >
        <option value="All">All Users</option>
        <option value="admin">Admin</option>
        <option value="client">Client</option>
    </select>
    <select
        className="border border-gray-300 bg-white px-4 py-2 rounded-lg outline-none text-sm"
        onChange={(e) => setFilterAction(e.target.value)}
    >
        <option value="All">All Actions</option>
        <option value="proposal_created">Proposal Created</option>
        <option value="link_generated">Link Generated</option>
        <option value="link_revoked">Link Revoked</option>
        <option value="link_unrevoked">Link Unrevoked</option>
        <option value="client_accessed">Client Accessed</option>
        <option value="signature_submitted">Signature Submitted</option>
    </select>
    <input
        type="date"
        className="border border-gray-300 bg-white px-4 py-2 rounded-lg outline-none text-sm"
        onChange={(e) => setFilterDate(e.target.value)}
    />
    {/* Clear Empty Logs Button */}
    <button
        onClick={handleClearEmpty}
        className="border border-gray-300 text-black px-4 py-2 rounded-lg text-sm bg-white"
    >
        Clear Empty Logs
    </button>
</div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 border-b text-gray-700">
                            <tr>
                                <th className="text-left px-6 py-4 font-semibold">Action</th>
                                <th className="text-left px-6 py-4 font-semibold">Client</th>
                                <th className="text-left px-6 py-4 font-semibold">Project</th>
                                <th className="text-left px-6 py-4 font-semibold">Performed By</th>
                                <th className="text-left px-6 py-4 font-semibold">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.length ? filteredLogs.map((log) => (
                                <tr key={log.id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <span className={`${getActionStyle(log.action)} text-xs font-medium px-3 py-1 rounded-full`}>
                                            {log.action.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {log.client_name}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {log.project_name}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {log.performed_by}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                       {new Date(log.created_at).toLocaleString()}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-4 text-gray-400">
                                        No logs found
                                    </td>
                                </tr>
                            )}
  
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AuditLogs