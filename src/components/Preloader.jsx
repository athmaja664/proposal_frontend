import React from 'react'

function Preloader() {
  return (
    <div className="flex items-start justify-center h-screen " style={{ background: "url('/Images/background_img.svg') #f9fafc center / cover no-repeat fixed" }}>
      <img 
        src="/icons/logo.svg"
        alt="Loading..." 
        className="w-40 h-40 mt-80"
      />
    </div>
  )
}

export default Preloader
