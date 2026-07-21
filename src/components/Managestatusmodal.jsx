import React, { useState, useEffect } from "react";
import { genereteProposalStatusAPI, createProposalStatusAPI, editProposalStatusAPI, removeProposalStatusAPI } from "../../services/allAPI";
import toast, { Toaster } from 'react-hot-toast'
import { FiTrash2, FiEdit2, FiX, FiCheck } from "react-icons/fi"

function ManageStatusModal({ onClose, onStatusesChanged }) {
    const [statuses, setStatuses] = useState([])
    const [newStatusName, setNewStatusName] = useState('')
    const [editingId, setEditingId] = useState(null)
    const [editingValue, setEditingValue] = useState('')
    const [loading, setLoading] = useState(false)

    const token = localStorage.getItem('token')
    const reqHeader = { Authorization: `Bearer ${token}` }

    const getStatuses = async () => {
        const response = await genereteProposalStatusAPI(reqHeader)
        if (response.status === 200) {
            setStatuses(response.data)
        }
    }

    useEffect(() => {
        getStatuses()
    }, [])

    // ADD NEW STATUS
    const handleAdd = async () => {
        if (!newStatusName.trim()) {
            toast.error('Enter a status name')
            return
        }
        setLoading(true)
        const response = await createProposalStatusAPI({ statusName: newStatusName.trim() }, reqHeader)
        setLoading(false)

        if (response.status === 200) {
            toast.success('Status added')
            setNewStatusName('')
            getStatuses()
            if (onStatusesChanged) onStatusesChanged()
        } else {
            toast.error(response.data.message || 'Something went wrong')
        }
    }

    // START RENAME
    const startEdit = (status) => {
        setEditingId(status.id)
        setEditingValue(status.status_name)
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditingValue('')
    }

    // SAVE RENAME
    const handleEditSave = async (id) => {
        if (!editingValue.trim()) {
            toast.error('Status name cannot be empty')
            return
        }
        const response = await editProposalStatusAPI(id, { statusName: editingValue.trim() }, reqHeader)

        if (response.status === 200) {
            toast.success('Status updated')
            cancelEdit()
            getStatuses()
            if (onStatusesChanged) onStatusesChanged()
        } else {
            toast.error(response.data.message || 'Something went wrong')
        }
    }

    // DELETE
    const handleDelete = async (id) => {
        const response = await removeProposalStatusAPI(id, reqHeader)

        if (response.status === 200) {
            toast.success('Status deleted')
            getStatuses()
            if (onStatusesChanged) onStatusesChanged()
        } else {
            toast.error(response.data.message || 'Cannot delete this status')
        }
    }

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-50 px-4">
            <Toaster position="top-center" />
            <div className="bg-white p-6 rounded-[16px] shadow-[0_4px_8px_0_rgba(214,214,214,0.4)] w-[90vw] max-w-md">

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-[#3f4050]">Manage Statuses</h2>
                    <button onClick={onClose} className="text-[#818293] hover:text-[#3f4050]">
                        <FiX size={20} />
                    </button>
                </div>

                {/* ADD NEW STATUS */}
                <div className="flex gap-2 mb-5">
                    <input
                        type="text"
                        placeholder="New status name"
                        value={newStatusName}
                        onChange={(e) => setNewStatusName(e.target.value)}
                        className="flex-1 border-2 border-[#d9dce8] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#576aff] text-[#3f4050]"
                    />
                    <button
                        onClick={handleAdd}
                        disabled={loading}
                        className="px-4 py-2 bg-[#576aff] hover:bg-[#3d52f2] text-white rounded-lg text-sm font-medium disabled:opacity-60"
                    >
                        Add
                    </button>
                </div>

                {/* STATUS LIST */}
                <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
                    {statuses.map((status) => (
                        <div
                            key={status.id}
                            className="flex items-center justify-between border-2 border-[#d9dce8] rounded-lg px-3 py-2"
                        >
                            {editingId === status.id ? (
                                <input
                                    type="text"
                                    value={editingValue}
                                    onChange={(e) => setEditingValue(e.target.value)}
                                    className="flex-1 border border-[#d9dce8] rounded px-2 py-1 text-sm outline-none focus:border-[#576aff] mr-2"
                                    autoFocus
                                />
                            ) : (
                                <span className="text-sm text-[#555665]">{status.status_name}</span>
                            )}

                            <div className="flex items-center gap-2">
                                {editingId === status.id ? (
                                    <>
                                        <button onClick={() => handleEditSave(status.id)} className="text-green-600 hover:text-green-700">
                                            <FiCheck size={16} />
                                        </button>
                                        <button onClick={cancelEdit} className="text-[#818293] hover:text-[#3f4050]">
                                            <FiX size={16} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => startEdit(status)} className="text-[#576aff] hover:text-[#3d52f2]">
                                            <FiEdit2 size={15} />
                                        </button>
                                        <button onClick={() => handleDelete(status.id)} className="text-red-500 hover:text-red-600">
                                            <FiTrash2 size={15} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ManageStatusModal