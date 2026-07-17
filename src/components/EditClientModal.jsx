import React, { useState } from "react";
import { FiX, FiUser, FiMail } from "react-icons/fi";
import toast from "react-hot-toast";
import { updateClientAPI } from "../../services/allAPI";


function EditClientModal({ client, onClose, getClient }) {
    const [editData, setEditData] = useState({
        name: client?.name || '',
        email: client?.email || ''
    })
    const [loading, setLoading] = useState(false)
    const token = localStorage.getItem('token')

    const handleUpdate = async () => {
        if (!editData.name || !editData.email) {
            toast.error('Please fill all fields')
            return
        }
        setLoading(true)
        const reqHeader = { Authorization: `Bearer ${token}` }
       const response = await updateClientAPI(client.id, editData, reqHeader)
        if (response.status === 200) {
            toast.success('Client updated successfully')
            getClient()
            onClose()
        } else {
            toast.error('Failed to update client')
        }
        setLoading(false)
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999] px-4">
            <div className="bg-white rounded-[16px] shadow-[0_8px_40px_rgba(9,8,20,0.15)] w-[440px] max-w-full p-8 relative">

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-[#818293] hover:text-[#576aff] transition-colors cursor-pointer"
                    aria-label="Close"
                >
                    <FiX size={20} />
                </button>

                <h2 className="text-[22px] font-semibold text-[#1e1e21] mb-6">
                    Edit Client
                </h2>

                <div className="flex flex-col gap-5 mb-8">

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-[#555665]">Client Name</label>
                        <div className="flex items-center gap-2 bg-white border-2 border-[#d9dce8] rounded-lg px-4 py-3 focus-within:border-[#576aff] transition-colors">
                            <FiUser className="text-[#9698a6]" size={16} />
                            <input
                                type="text"
                                value={editData.name}
                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                className="w-full outline-none text-sm text-[#1e1e21]"
                                placeholder="Client Name"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-[#555665]">Client Email</label>
                        <div className="flex items-center gap-2 bg-white border-2 border-[#d9dce8] rounded-lg px-4 py-3 focus-within:border-[#576aff] transition-colors">
                            <FiMail className="text-[#9698a6]" size={16} />
                            <input
                                type="email"
                                value={editData.email}
                                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                className="w-full outline-none text-sm text-[#1e1e21]"
                                placeholder="Client Email"
                            />
                        </div>
                    </div>

                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-medium text-[#555665] border-2 border-[#d9dce8] rounded-[8px] hover:bg-[#f9fafc] transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpdate}
                        disabled={loading}
                        className="px-5 py-2.5 text-sm font-medium text-white bg-[#576aff] rounded-[8px] hover:bg-[#3d52f2] transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default EditClientModal;