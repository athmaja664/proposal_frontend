import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { addclientAPI, addprojectAPI, createProposalAPI, getclientAPI, getProjectAPI } from "../../../services/allAPI";
import Select from 'react-select'
import toast, { Toaster } from 'react-hot-toast'
function CreateProposal() {
    const navigate = useNavigate()

    // show/hide new client/project
    const [showNewClient, setShowNewClient] = useState(false)
    const [showNewProject, setShowNewProject] = useState(false)
 
    // dropdown data
    const [clients, setClients] = useState([])
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(false)

    // form data
    const [proposalData, setProposalData] = useState({
        clientId: '',
        projectId: '',
        cost: '',
        status: 'Draft',
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

    useEffect(() => {
        getClients()
        getProjects()
    }, [])

    // handle client dropdown change
    const handleClientChange = (selected) => {
        if (selected.value === 'new') {
            setShowNewClient(true)
            setProposalData({ ...proposalData, clientId: '' })
        } else {
            setShowNewClient(false)
            setProposalData({ ...proposalData, clientId:selected.value })
        }
    }

    // handle project dropdown change
    const handleProjectChange = (selected) => {
        if (selected.value === 'new') {
            setShowNewProject(true)
            setProposalData({ ...proposalData, projectId: '' })
        } else {
            setShowNewProject(false)
            setProposalData({ ...proposalData, projectId:selected.value })
        }
    }
    //Dropdown search
    const clientOptions = [ ...clients.map(client => ({ value: client.id, label: client.name })) ,
    { value: 'new', label: '+ New Client' }

    ]

    const projectOptions = [ ...projects.map(project => ({ value:project.id,label:project.project_name})) ,
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
        if (!clientId || !projectId || !proposalData.description) {
            toast.error('Please fill all required fields!')
            return
        }

        const formData = new FormData()
        formData.append('clientId', clientId)
        formData.append('projectId', projectId)
        formData.append('cost', proposalData.cost)
        formData.append('status', proposalData.status)
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
            toast.error(response.data.message)
            setLoading(false)
        }
    }

    return (
        <div className="flex">
             <Toaster position="top-center" />
            <Sidebar />
            <div className="flex-1 bg-blue-50 p-6">
                <h1 className="text-2xl font-semibold mb-2">Create Proposal</h1>
                <p className="text-gray-500 text-sm mb-6">Fill in the details below</p>

                <div className="bg-white p-6 rounded shadow">
                    <div className="grid grid-cols-2 gap-4">


                        <div>
                            <label className="text-sm text-gray-500 mb-1 block">Select Client</label>
                            <Select
                                options={clientOptions}
                                placeholder="Search client"
                                onChange={handleClientChange}
                            />
                        </div>


                        <div>
                            <label className="text-sm text-gray-500 mb-1 block">Select Project</label>

                            <Select
                                options={projectOptions}
                                placeholder="Search project"
                                onChange={handleProjectChange}
                            />
                        </div>


                        {showNewClient && (
                            <div className="col-span-2 bg-gray-50 p-4 rounded border">
                                <p className="text-sm font-medium mb-3">New client details</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        
                                        <input
                                            type="text"
                                            placeholder="Client Name"
                                            className="border p-2 rounded w-full"
                                            onChange={(e) => setNewClientData({ ...newClientData, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        
                                        <input
                                            type="email"
                                            placeholder="Client Email"
                                            className="border p-2 rounded w-full"
                                            onChange={(e) => setNewClientData({ ...newClientData, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {showNewProject && (
                            <div className="col-span-2 bg-gray-50 p-4 rounded border">
                                <p className="text-sm font-medium mb-3">New project details</p>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Project Name"
                                        className="border p-2 rounded w-full"
                                        onChange={(e) => setNewProjectData({ projectName: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}


                        <div>
                            <label className="text-sm text-gray-500 mb-1 block">Cost</label>
                            <input
                                type="number"
                                placeholder=""
                                className="border p-2 rounded w-full"
                                onChange={(e) => setProposalData({ ...proposalData, cost: e.target.value })}
                            />
                        </div>


                        <div>
                            <label className="text-sm text-gray-500 mb-1 block">Status</label>
                            <select
                                className="border p-2 rounded w-full"
                                onChange={(e) => setProposalData({ ...proposalData, status: e.target.value })}
                            >
                                <option value="Draft">Draft</option>
                                <option value="Sent">Sent</option>
                                <option value="Accepted">Accepted</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Archived">Archived</option>
                            </select>
                        </div>

                    </div>


                    <div className="mt-4">
                        <label className="text-sm text-gray-500 mb-1 block">Description</label>
                        <textarea
                            placeholder=""
                            className="w-full border p-2 rounded"
                            rows="4"
                            onChange={(e) => setProposalData({ ...proposalData, description: e.target.value })}
                        ></textarea>
                    </div>


                    <div className="border-2 border-dashed p-6 mt-4 text-center rounded text-gray-500">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setProposalData({ ...proposalData, document: e.target.files[0] })}
                        />
                    </div>


                    <div className="flex justify-end gap-3 mt-6">
                        <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded cursor-pointer">Cancel</button>
                        <button  onClick={handleCreate} className="px-4 py-2 bg-black text-white rounded cursor-pointer"style={{ background: "linear-gradient(145deg, #111111 0%, #333333 100%)" }}>
                           
                            {loading ? 'Creating' : ' Create Proposal'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default CreateProposal;