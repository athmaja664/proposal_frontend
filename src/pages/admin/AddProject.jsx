// // import React, { useState } from "react";
// // import Sidebar from "../../components/Sidebar";
// // import { useNavigate } from "react-router-dom";
// // import { addclientAPI } from "../../../services/allAPI";


// // function AddClient() {
// //     const navigate = useNavigate()
// //     const [clientData, setClientData] = useState({
// //         name: '',
// //         email: ''
// //     })

// //     const handleAddClient = async () => {
// //         if (!clientData.name || !clientData.email) {
// //             alert('Please fill all fields!')
// //             return
// //         }

// //         const token = localStorage.getItem('token')
// //         const reqHeader = { Authorization: `Bearer ${token}` }

// //         const response = await addclientAPI(clientData, reqHeader)
// //         console.log(response)

// //         if (response.status === 200) {
// //             alert('Client Added Successfully!')
// //             navigate('/addproject')
// //         } else {
// //             alert(response.data.message)
// //         }
// //     }

// //     return (
// //         <div className="flex">
// //             <Sidebar />
// //             <div className="flex-1 bg-blue-50 p-6">
// //                 <h1 className="text-2xl font-semibold mb-2">Add Client</h1>
// //                 <p className="text-gray-500 text-sm mb-6">Add a new client to the system</p>

// //                 <div className="bg-white p-6 rounded shadow">
// //                     <div className="grid grid-cols-2 gap-4">
// //                         <div>
// //                             <label className="text-sm text-gray-500 mb-1 block">Client Name</label>
// //                             <input
// //                                 type="text"
// //                                 placeholder="Enter Name"
// //                                 className="border p-2 rounded w-full"
// //                                 onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
// //                             />
// //                         </div>
// //                         <div>
// //                             <label className="text-sm text-gray-500 mb-1 block">Client Email</label>
// //                             <input
// //                                 type="email"
// //                                 placeholder="Enter Email"
// //                                 className="border p-2 rounded w-full"
// //                                 onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
// //                             />
// //                         </div>
// //                     </div>
// //                     <div className="flex justify-end gap-3 mt-6">
// //                         <button
// //                             onClick={() => navigate(-1)}
// //                             className="px-4 py-2 border rounded">
// //                             Cancel
// //                         </button>
// //                         <button
// //                             onClick={handleAddClient}
// //                             className="px-4 py-2 bg-black text-white rounded">
// //                             Add Client
// //                         </button>
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }

// // export default AddClient;