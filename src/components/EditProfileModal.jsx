import React, { useState } from "react";
import { updateAdminProfileAPI } from "../../services/allAPI";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FiX, FiUser, FiMail, FiLock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast'
function EditProfileModal({ onClose, admin, onUpdate }) {
    const navigate = useNavigate();
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [profileData, setProfileData] = useState({
        name: admin?.name || '',
        email: admin?.email || '',
        currentPassword: '',
        newPassword: ''
    })
    const handleProfileUpdate = async () => {
        if (!profileData.currentPassword) {
            toast.error('Enter the current password ')
            return
        }
        setLoading(true)
        const token = localStorage.getItem('token')
        const reqHeader = {
            Authorization: `Bearer ${token}`
        }
        const response = await updateAdminProfileAPI(profileData, reqHeader)


        if (response.status === 200) {
            toast.success('Profile updated successfullyy')
            toast.success('Login again')
            //setLoading(false)
            onUpdate(response.data.user)
            onClose()
            navigate("/")
        } else {
            toast.error(response.data.message)
            setLoading(false)
        }
    }
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999] px-4">
            <Toaster position="top-center" />
            <div className="rounded-[16px] shadow-[0_8px_40px_rgba(9,8,20,0.15)] w-[440px] max-w-full p-8 relative" style={{
                    background: "url('/Images/background_img.svg') #ffffff center / cover no-repeat"
                }}>

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-[#818293] hover:text-[#576aff] transition-colors cursor-pointer"
                    aria-label="Close"
                >
                    <FiX size={20} />
                </button>

                <h2 className="text-[22px] font-semibold text-[#1e1e21] mb-6">
                    Edit Profile
                </h2>

                <div className="flex flex-col gap-5 mb-8">

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray">Name</label>
                        <div className="flex items-center gap-2 bg-white border-2 border-[#d9dce8] rounded-lg px-4 py-3 focus-within:border-[#576aff] transition-colors">
                            <FiUser className="text-[#9698a6]" size={16} />
                            <input
                                type="text"
                                value={profileData.name}
                                placeholder="Enter name"
                                className="w-full outline-none text-sm text-[#1e1e21]"
                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray">Email</label>
                        <div className="flex items-center gap-2 bg-white border-2 border-[#d9dce8] rounded-lg px-4 py-3 focus-within:border-[#576aff] transition-colors">
                            <FiMail className="text-[#9698a6]" size={16} />
                            <input
                                type="email"
                                value={profileData.email}
                                placeholder="Enter email"
                                className="w-full outline-none text-sm text-[#1e1e21]"
                                onChange={(e) => {
                                    setProfileData({ ...profileData, email: e.target.value })
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray">
                            Current Password <span className="text-red-400">*</span>
                        </label>
                        <div className="flex items-center gap-2 bg-white border-2 border-[#d9dce8] rounded-lg px-4 py-3 focus-within:border-[#576aff] transition-colors">
                            <FiLock className="text-[#9698a6]" size={16} />
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                name="password"
                                autoComplete="current-password"
                                placeholder="Enter current password"
                                className="w-full outline-none text-sm text-[#1e1e21]"
                                onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                            />
                            <span
                                className="text-[#818293] cursor-pointer hover:text-[#576aff] transition-colors"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                                {showCurrentPassword ? <AiOutlineEyeInvisible size={16} /> : <AiOutlineEye size={16} />}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray">
                            New Password <span className="text-[#9698a6] text-xs font-normal">(optional)</span>
                        </label>
                        <div className="flex items-center gap-2 bg-white border-2 border-[#d9dce8] rounded-lg px-4 py-3 focus-within:border-[#576aff] transition-colors">
                            <FiLock className="text-[#9698a6]" size={16} />
                            <input
                                type={showNewPassword ? "text" : "password"}
                                placeholder="Leave blank to keep current"
                                className="w-full outline-none text-sm text-[#1e1e21]"
                                onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                            />
                            <span
                                className="text-[#818293] cursor-pointer hover:text-[#576aff] transition-colors"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? <AiOutlineEyeInvisible size={16} /> : <AiOutlineEye size={16} />}
                            </span>
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
                        onClick={handleProfileUpdate}
                        disabled={loading}
                        className="px-5 py-2.5 text-sm font-medium text-white bg-[#576aff] rounded-[8px] hover:bg-[#3d52f2] transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default EditProfileModal;