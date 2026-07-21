import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { addclientAPI, addprojectAPI, createProposalAPI, getclientAPI, getProjectAPI, genereteProposalStatusAPI } from "../../../services/allAPI";
import Select from 'react-select'
import toast, { Toaster } from 'react-hot-toast'
import { FiUser, FiMail, FiFolder, FiUploadCloud, FiCheck } from "react-icons/fi"
import ManageStatusModal from "../../components/Managestatusmodal";

function CreateProposal() {
    const navigate = useNavigate()

    const [showManageStatus, setShowManageStatus] = useState(false)
    // show/hide new client/project
    const [showNewClient, setShowNewClient] = useState(false)
    const [showNewProject, setShowNewProject] = useState(false)

    // dropdown data
    const [clients, setClients] = useState([])
    const [projects, setProjects] = useState([])
    const [statuses, setStatuses] = useState([])
    const [loading, setLoading] = useState(false)

    // form data
    const [proposalData, setProposalData] = useState({
        clientId: '',
        projectId: '',
        cost: '',
        statusId: '',
        description: '',
        document: ''
    })

    // new client data
    const [newClientData, setNewClientData] = useState({
        name: '',
        email: ''
    })

    // new project data
    const [newProjectData, setNewProjectData] = useState({
        projectName: ''
    })

    const token = localStorage.getItem('token')
    const reqHeader = { Authorization: `Bearer ${token}` }

    // fetch clients
    const getClients = async () => {
        const response = await getclientAPI(reqHeader)
        if (response.status === 200)
            setClients(response.data)
    }

    // fetch projects
    const getProjects = async () => {
        const response = await getProjectAPI(reqHeader)
        if (response.status === 200)
            setProjects(response.data)
    }

    // fetch statuses
    const getStatuses = async () => {
        const response = await genereteProposalStatusAPI(reqHeader)
        if (response.status === 200) {
            setStatuses(response.data)

            const draftStatus = response.data.find(s => s.status_name === 'Draft')
            if (draftStatus) {
                setProposalData(prev => ({ ...prev, statusId: draftStatus.id }))
            }
        }
    }

    useEffect(() => {
        getClients()
        getProjects()
        getStatuses()
    }, [])

    // handle client dropdown change
    const handleClientChange = (selected) => {
        if (selected.value === 'new') {
            setShowNewClient(true)
            setProposalData({ ...proposalData, clientId: '' })
        } else {
            setShowNewClient(false)
            setProposalData({ ...proposalData, clientId: selected.value })
        }
    }

    // handle project dropdown change
    const handleProjectChange = (selected) => {
        if (selected.value === 'new') {
            setShowNewProject(true)
            setProposalData({ ...proposalData, projectId: '' })
        } else {
            setShowNewProject(false)
            setProposalData({ ...proposalData, projectId: selected.value })
        }
    }

    // Dropdown search
    const clientOptions = [...clients.map(client => ({ value: client.id, label: client.name })),
    { value: 'new', label: '+ New Client' }
    ]

    const projectOptions = [...projects.map(project => ({ value: project.id, label: project.project_name })),
    { value: 'new', label: '+ New Project' }
    ]

    const handleCreate = async () => {
        let clientId = proposalData.clientId
        let projectId = proposalData.projectId

        // if new client 
        if (showNewClient) {
            if (!newClientData.name || !newClientData.email) {
                toast.error('Please fill client Form')
                return
            }
            const clientRes = await addclientAPI(newClientData, reqHeader)
            if (clientRes.status === 200) {
                clientId = clientRes.data.newClient.id
            } else {
                toast.error(clientRes.data.message)
                return
            }
        }

        // if new project 
        if (showNewProject) {
            if (!newProjectData.projectName) {
                toast.error('Please fill project name!')
                return
            }
            const projectRes = await addprojectAPI({ projectName: newProjectData.projectName, clientId }, reqHeader)
            if (projectRes.status === 200) {
                projectId = projectRes.data.newProject.id
            } else {
                toast.error(projectRes.data.message)
                return
            }
        }
        setLoading(true)
        if (!clientId || !projectId || !proposalData.description || !proposalData.cost) {
            toast.error('Please fill all required fields!')
            return
        }

        const formData = new FormData()
        formData.append('clientId', clientId)
        formData.append('projectId', projectId)
        formData.append('cost', proposalData.cost)
        formData.append('statusId', proposalData.statusId)
        formData.append('description', proposalData.description)
        formData.append('document', proposalData.document)

        const fileHeader = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
        }

        const response = await createProposalAPI(formData, fileHeader)
        console.log(response)

        if (response.status === 200) {
            toast.success('Proposal Created Successfully!')
            navigate('/proposals')
        } else {
            toast.error(response.data.message || response.data.error || 'Something went wrong')
            setLoading(false)
        }
    }


    return (
        <div className="bg-white min-h-screen" style={{ background: "url('/Images/background_img.svg') #f9fafc center / cover no-repeat fixed" }}>
            <Toaster position="top-center" />
            <Sidebar />

            <div className="max-w-[1500px] mx-auto px-8 py-8">
                <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-8">

                    <div className="mb-6">
                        <label className="text-[15px] text-[#1e1e21] mb-2 block">Select Client</label>
                        <Select
                            options={clientOptions}
                            placeholder="Search client"
                            onChange={handleClientChange}
                        // styles={selectStyles}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="text-[15px] text-[#1e1e21] mb-2 block">Select Project</label>
                        <Select
                            options={projectOptions}
                            placeholder="Search project"
                            onChange={handleProjectChange}
                        // styles={selectStyles}
                        />
                    </div>

                    {showNewClient && (
                        <div className="bg-[#f7f7fb] rounded-xl p-6 mb-6">
                            <p className="text-[16px] font-semibold text-[#1e1e21] mb-4">New Client Details</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-[#818293] mb-1 block">Client Name</label>
                                    <div className="flex items-center gap-2 bg-white border-2 border-[#cfd3de] rounded-lg px-4 py-3 focus-within:border-[#576aff]">
                                        <FiUser className="text-[#9698a6]" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Client Name"
                                            className="w-full outline-none text-sm"
                                            onChange={(e) => setNewClientData({ ...newClientData, name: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm text-[#818293] mb-1 block">Client Email</label>
                                    <div className="flex items-center gap-2 bg-white border-2 border-[#cfd3de] rounded-lg px-4 py-3 focus-within:border-[#576aff]">
                                        <FiMail className="text-[#9698a6]" size={18} />
                                        <input
                                            type="email"
                                            placeholder="Client Email"
                                            className="w-full outline-none text-sm"
                                            onChange={(e) => setNewClientData({ ...newClientData, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {showNewProject && (
                        <div className="bg-[#f7f7fb] rounded-xl p-6 mb-6">
                            <p className="text-[16px] font-semibold text-[#1e1e21] mb-4">New Project Details</p>
                            <div>
                                <label className="text-sm text-[#818293] mb-1 block">Project Name</label>
                                <div className="flex items-center gap-2 bg-white border-2 border-[#cfd3de] rounded-lg px-4 py-3 focus-within:border-[#576aff]">
                                    <FiFolder className="text-[#9698a6]" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Project Name"
                                        className="w-full outline-none text-sm"
                                        onChange={(e) => setNewProjectData({ projectName: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="bg-[#f7f7fb] rounded-xl p-6 mb-8">
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="text-sm text-[#818293] mb-1 block">Cost</label>
                                <div className="flex items-center gap-2 border-2 border-[#cfd3de] rounded-lg px-4 py-3 focus-within:border-[#576aff]">
                                    <span className="text-[#9698a6]">$</span>
                                    <input
                                        type="number"
                                        placeholder="5000"
                                        className="w-full outline-none text-sm"
                                        onChange={(e) => setProposalData({ ...proposalData, cost: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-sm text-[#818293] block">Status</label>
                                    <button
                                        type="button"
                                        onClick={() => setShowManageStatus(true)}
                                        className="text-xs text-[#576aff] hover:underline"
                                    >
                                        + Manage Statuses
                                    </button>
                                </div>
                                <select
                                    className="w-full  border-2 border-[#cfd3de] rounded-lg px-4 py-4 text-sm outline-none focus:border-[#576aff]"
                                    value={proposalData.statusId}
                                    onChange={(e) => setProposalData({ ...proposalData, statusId: e.target.value })}
                                >
                                    {statuses.map(status => (
                                        <option key={status.id} value={status.id}>{status.status_name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>


                        <div className="mb-6">
                            <label className="text-sm text-[#818293] mb-1 block">Description</label>
                            <textarea
                                placeholder="Proposal Description..."
                                className="w-full  border-2 border-[#cfd3de] rounded-lg p-4 text-sm outline-none focus:border-[#576aff]"
                                rows="5"
                                onChange={(e) => setProposalData({ ...proposalData, description: e.target.value })}
                            ></textarea>
                        </div>
                    </div>
                    <div className="bg-[#f7f7fb] rounded-xl p-6 mb-8">
                        <div className="border-2 border-dashed border-[#c7cbe8] rounded-xl py-12 mb-8 flex flex-col items-center justify-center text-center">
                            <FiUploadCloud className="text-[#576aff] mb-3" size={36} />
                            <label className="cursor-pointer">
                                <span className="text-[#576aff] underline text-sm font-medium">Choose File</span>
                                <span className="text-[#818293] text-sm"> or drag and drop</span>
                                <input
                                    type="file"
                                    accept=".pdf"
                                    className="hidden"
                                    onChange={(e) => setProposalData({ ...proposalData, document: e.target.files[0] })}
                                />
                            </label>
                            <p className="text-[#9698a6] text-sm mt-1">
                                {proposalData.document ? proposalData.document.name : "No file chosen"}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mb-10">
                        <button onClick={() => navigate(-1)} className="px-6 py-3 border border-[#e4e4eb] rounded-lg text-sm text-[#555665] cursor-pointer hover:bg-gray-50">
                            Cancel
                        </button>
                        <button
                            onClick={handleCreate}
                            className="flex items-center gap-2 px-6 py-3 bg-[#576aff] hover:bg-[#3d52f2] text-white rounded-lg text-sm font-medium cursor-pointer transition-colors"
                        >
                            <FiCheck size={16} />
                            {loading ? 'Creating...' : 'Create Proposal'}
                        </button>
                    </div>

                </div>
            </div>

            {showManageStatus && (
                <ManageStatusModal
                    onClose={() => setShowManageStatus(false)}
                    onStatusesChanged={getStatuses}
                />
            )}
        </div>
    );
}

export default CreateProposal;