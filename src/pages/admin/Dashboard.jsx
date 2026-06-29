import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import { listProposalAPI } from "../../../services/allAPI";
import { IoFileTrayFull } from "react-icons/io5";
import { FcAcceptDatabase } from "react-icons/fc";
import { HiPresentationChartLine } from "react-icons/hi";
import { MdOutlineSmsFailed } from "react-icons/md";
import Spinner from "../../components/Spinner";
function Dashboard() {
    const navigate = useNavigate()
    const [proposalData, setProposalData] = useState([])
    //spinner
    const [loading,setLoading]=useState(true)
    const getProposals = async () => {
        const token = localStorage.getItem('token')
        const reqHeader = { Authorization: `Bearer ${token}` }//crt tokn
        const response = await listProposalAPI(reqHeader)//snt tkn to bc
        if (response.status === 200) {
            setProposalData(response.data)
        }
        setLoading(false)
    }
    useEffect(() => {
        getProposals()
    }, [])



    const totalProposals = proposalData.length
    const acceptedProposals = proposalData.filter((item) => item.status === 'Accepted').length
    const sentingProposals = proposalData.filter((item) => item.status === 'Sent').length
    const rejectedProposals = proposalData.filter((item) => item.status === 'Rejected').length


    const getStatusStyle = (status) => {
        if (status === 'Accepted') return 'bg-green-100 text-green-700'
        if (status === 'Sent') return 'bg-yellow-100 text-yellow-700'
        if (status === 'Draft') return 'bg-gray-200 text-gray-700'
        if (status === 'Rejected') return 'bg-red-100 text-red-700'
        if (status === 'Archived') return 'bg-blue-100 text-blue-700'
    }
    if (loading) return <Spinner />
    return (
        <>
            <div className="flex">

                <Sidebar />

                <div className="flex-1 bg-blue-50 p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-semibold">Dashboard</h1>
                            <p className="text-gray-500">Welcome back, Admin</p>
                        </div>

                        <button className="text-white px-4 py-2 rounded" >
                            <Link to="/createproposal" className="text-white p-3  " style={{ background: "linear-gradient(145deg, #111111 0%, #333333 100%)" }} >
                                + New Proposal
                            </Link>

                        </button>
                    </div>

                    <div className="grid grid-cols-4 gap-5 mt-8">
                        <div
                            className="group p-4 rounded shadow text-white flex justify-between items-end relative overflow-hidden  cursor-pointer"
                            style={{ background: "linear-gradient(145deg, #111111 0%, #333333 100%)" }}
                        >
                            <div className="relative z-10">
                                <p>Total Proposals</p>

                                <h2 className="text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {totalProposals}
                                </h2>
                            </div>

                            <IoFileTrayFull className="text-4xl mb-1" />
                        </div>
                        <div
                            className="group p-4 rounded shadow text-white flex justify-between items-end relative overflow-hidden  cursor-pointer"
                            style={{ background: "linear-gradient(135deg, #2d2d2d 0%, #0a0a0a 100%)" }}
                        >
                            <div className="relative z-10">
                                <p>Accepted</p>

                                <h2 className="text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {acceptedProposals}
                                </h2>
                            </div>
                            <FcAcceptDatabase className="text-4xl mb-1" />
                        </div>
                        <div
                            className="group p-4 rounded shadow text-white flex justify-between items-end  relative overflow-hidden  cursor-pointer"
                            style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #3d3d3d 100%)" }}
                        >
                            <div className="relative z-10">
                                <p>Sent</p>

                                <h2 className="text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {sentingProposals}
                                </h2>
                            </div>
                            <HiPresentationChartLine className="text-4xl mb-1"/>

                        </div>
                        <div
                            className="group p-4 rounded shadow text-white flex justify-between items-end  relative overflow-hidden  cursor-pointer"
                            style={{ background: "linear-gradient(135deg, #3d3d3d 0%, #1a1a1a 100%)" }}
                        >
                            <div className="relative z-10">
                                <p>Rejected</p>

                                <h2 className="text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {rejectedProposals}
                                </h2>
                            </div>
                            <MdOutlineSmsFailed className="text-4xl mb-1"/>
                        </div>



                    </div>

                    <div className="bg-white mt-10 p-5 rounded shadow">
                        <h2 className="text-lg font-semibold mb-4">
                            Recent Proposals
                        </h2>

                        <table className="w-full text-sm">
                            <thead className="border-b text-gray-500">
                                <tr>
                                    <th className="text-left p-2">Project</th>
                                    <th className="text-left p-2">Client</th>
                                    <th className="text-left p-2">Status</th>
                                    <th className="text-left p-2">Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                {proposalData.slice(-4).map((item) => (
                                    <tr key={item.id} className="border-b">
                                        <td className="p-2">{item.project_name}</td>
                                        <td className="p-2 text-gray-500">{item.client_name}</td>
                                        <td className="p-2">
                                            <span className={`${getStatusStyle(item.status)} px-2 py-1 rounded text-xs`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="p-2 text-gray-500">{item.created_at.slice(0, 10)}</td>
                                    </tr>
                                ))}




                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </>
    );
}

export default Dashboard;