import React, { useState } from "react";
import { updateAdminProfileAPI } from "../../services/allAPI";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast'
function EditProfileModal({onClose,admin,onUpdate}) {
   const navigate = useNavigate();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
const [showNewPassword, setShowNewPassword] = useState(false)
     const [loading, setLoading] = useState(false)
  const [profileData,setProfileData]=useState({
    name:admin?.name|| '',
    email:admin?.email|| '',
    currentPassword:'',
    newPassword:''
  })
  const handleProfileUpdate=async()=>{
    if(!profileData.currentPassword){
      toast.error('Enter the current password ')
      return
    }
    setLoading(true)
    const token=localStorage.getItem('token')
    const reqHeader={
      Authorization:`Bearer ${token}`
    }
    const response=await updateAdminProfileAPI(profileData,reqHeader)
   
    
    if(response.status===200){
      toast.success('Profile updated successfullyy')
      toast.success('Login again')
       //setLoading(false)
      onUpdate(response.data.user)
      onClose()
       navigate("/")
    }else{
      toast.error(response.data.message)
      setLoading(false)
    }
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Toaster position="top-center" />
      <div className="bg-white p-6 rounded shadow w-full max-w-md text-gray-900">
        <h2 className="text-xl font-semibold mb-5">Edit Profile</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Name</label>
            <input
              type="text"
              value={profileData.name}
              placeholder="Enter name"
              className="border p-2 rounded w-full"
              onChange={(e)=>setProfileData({...profileData,name:e.target.value})}
            />
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-1 block">Email</label>
            <input
              type="email"
              value={profileData.email}
              placeholder="Enter email"
              className="border p-2 rounded w-full"
              onChange={(e)=>{
                setProfileData({...profileData,email:e.target.value})
              }}
            />
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-1 block">
              Current Password
              <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center border rounded px-2 bg-white">
              <input
                type={showCurrentPassword?"text":"password"}
                name="password"
                autoComplete="current-password"
                placeholder="Enter current password"
                className="p-2 w-full outline-none"
                onChange={(e)=>setProfileData({...profileData,currentPassword:e.target.value})}
              />
              <span className="text-gray-400 cursor-pointer" onClick={()=>setShowCurrentPassword(!showCurrentPassword)}>
                 {showCurrentPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-1 block">
              New Password
              <span className="text-gray-400 text-xs"> (optional)</span>
            </label>
            <div className="flex items-center border rounded px-2 bg-white">
              <input
                type={showNewPassword?"text":"password"}
                placeholder="Leave blank to keep current"
                className="p-2 w-full outline-none"
                onChange={(e)=>setProfileData({...profileData,newPassword:e.target.value})}
              />
              <span className="text-gray-400 cursor-pointer" onClick={()=>setShowNewPassword(!showNewPassword)
              }>
                {showNewPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 border rounded cursor-pointer">
            Cancel
          </button>
          <button onClick={handleProfileUpdate} className="px-4 py-2 bg-black text-white rounded cursor-pointer">
            {loading ? 'Updating...' : '     Update Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfileModal;