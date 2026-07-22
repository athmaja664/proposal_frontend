import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { RiFileList3Fill } from "react-icons/ri";
import { MdAccountCircle } from "react-icons/md";
import { FiLogOut, FiEdit } from "react-icons/fi";
import EditProfileModal from "./EditProfileModal";

function Sidebar() {
  const [admin, setAdmin] = useState(null);
  const [showMenu, setShowMenu] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null)

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const adminData = localStorage.getItem("admin");

    if (adminData && adminData !== "undefined") {
      setAdmin(JSON.parse(adminData));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    localStorage.removeItem('admin')
    localStorage.removeItem('token')
    navigate("/");
  }

  return (
    <header className="flex flex-wrap items-center justify-center lg:justify-between gap-y-4 w-full px-4 sm:px-6 lg:px-10 py-4 lg:py-6 bg-transparent">

      <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold text-[#1e1e21] no-underline shrink-0" aria-label="ProposalHub home">
        <img
          src="/icons/logo.svg"
          alt="ProposalHub"
          className="h-9 sm:h-11 w-auto"
        />
      </Link>

      <nav className="flex items-center justify-center gap-4 sm:gap-6 lg:gap-8 flex-wrap order-3 lg:order-none w-full lg:w-auto" aria-label="Main navigation">
        <Link to="/dashboard" className={`text-sm sm:text-[16px] font-normal no-underline transition-colors ${isActive('/dashboard') ? 'text-[#576aff] font-medium' : 'text-[#555665] hover:text-[#576aff]'}`}>
          Dashboard
        </Link>
        <Link to="/proposals" className={`text-sm sm:text-[16px] font-normal no-underline transition-colors ${isActive('/proposals') ? 'text-[#576aff] font-medium' : 'text-[#555665] hover:text-[#576aff]'}`}>
          Proposal
        </Link>

        {/* <a href="/viewproposals" className="text-[16px] font-normal text-[#555665] hover:text-[#576aff] no-underline transition-colors">
          View Proposals
        </a> */}

        <a href="/clients" className="text-sm sm:text-[16px] font-normal text-[#555665] hover:text-[#576aff] no-underline transition-colors">
          Client
        </a>
        <Link to="/auditlogs" className={`text-sm sm:text-[16px] font-normal no-underline transition-colors ${isActive('/auditlogs') ? 'text-[#576aff] font-medium' : 'text-[#555665] hover:text-[#576aff]'}`}>
          AuditLogs
        </Link>
        {/* TODO: no route yet for Setting — using placeholder until Athmaja provides the real path */}
        {/* <a href="#" className="text-[16px] font-normal text-[#555665] hover:text-[#576aff] no-underline transition-colors">
          Setting
        </a> */}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="text-sm sm:text-[16px] font-normal text-[#555665] hover:text-[#576aff] transition-colors bg-transparent border-none cursor-pointer p-0"
        >
          Logout
        </button>
      </nav>

      <div className="flex items-center gap-3 sm:gap-5 shrink-0 order-2 lg:order-none">
        <Link
          to="/createproposal"
          className="inline-flex items-center justify-center gap-2 h-[40px] sm:h-[45px] px-3 sm:px-4 text-xs sm:text-sm font-medium text-white bg-[#576aff] rounded-[4px] no-underline hover:bg-[#3d52f2] transition-colors whitespace-nowrap"
        >
          + New Proposal
        </Link>

        {admin && (
          <div
            ref={menuRef}
            className="relative flex items-center gap-2 cursor-pointer"
            onClick={() => setShowMenu(prev => !prev)}
            onContextMenu={(e) => e.preventDefault()}
          >
            <button className="text-[#818293] hover:text-[#576aff] transition-colors cursor-pointer">
              <MdAccountCircle size={28} className="sm:hidden" />
              <MdAccountCircle size={30} className="hidden sm:block" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute top-11 right-0 bg-white rounded-lg shadow-lg py-2 w-44 z-50 border border-[#e4e4eb] cursor-pointer">
                <p className="px-4 py-2 text-sm font-semibold text-[#1e1e21] border-b border-[#e4e4eb] truncate">{admin.name}</p>
                <button
                  onClick={() => { setShowEditProfile(true); setShowMenu(false) }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <FiEdit size={14} />
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <EditProfileModal
          admin={admin}
          onClose={() => setShowEditProfile(false)}
          onUpdate={(updatedAdmin) => {
            setAdmin(updatedAdmin)
            localStorage.setItem('admin', JSON.stringify(updatedAdmin))
          }}
        />
      )}

      {/* Logout Confirmation Popup */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999] px-4">
          <div className="bg-white rounded-[16px] shadow-lg w-full max-w-[360px] p-6">
            <h3 className="text-lg font-semibold text-[#1e1e21] mb-2">
              Log out?
            </h3>
            <p className="text-sm text-[#555665] mb-6">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-[#555665] border-2 border-[#d9dce8] rounded-[8px] hover:bg-[#f9fafc] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false)
                  handleLogout()
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-[#576aff] rounded-[8px] hover:bg-[#3d52f2] transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Sidebar;