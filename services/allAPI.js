import { serverURL } from "./serverURL"
import commonAPI from "./commonAPI"

// ADMIN LOGIN
export const adminLoginAPI = async (reqBody) => {
  return await commonAPI('POST', `${serverURL}/api/adminlogin`, reqBody, {})
}

//FORGOT PASSWORD
export const forgotPasswordAPI = async (reqBody, reqHeader) => {
  return await commonAPI('POST', `${serverURL}/api/forgot-password`, reqBody, reqHeader)
}

//RESET PASSWORD
export const resetPasswordAPI = async (token, reqBody) => {
  return await commonAPI('POST', `${serverURL}/api/reset-password/${token}`, reqBody, {})
}

//ADD CLIENT
export const addclientAPI = async (reqBody, reqHeader) => {
  return await commonAPI('POST', `${serverURL}/api/addclient`, reqBody, reqHeader)
}

//GET THE CLIENT FOR THE ADD PROJECT
export const getclientAPI = async (reqHeader) => {
  return await commonAPI('GET', `${serverURL}/api/getclient`, {}, reqHeader)
}

//UPDATE CLIENT
export const updateClientAPI = async (id, reqBody, reqHeader) => {
  return await commonAPI('PUT', `${serverURL}/api/updateclient/${id}`, reqBody, reqHeader)
}

//DELETE CLIENT
export const deleteClientAPI=async(id,reqHeader)=>{
  return await commonAPI('DELETE',`${serverURL}/api/deleteclient/${id}`,{},reqHeader)
}

//ADD PROJECT
export const addprojectAPI = async (reqBody, reqHeader) => {
  return await commonAPI('POST', `${serverURL}/api/addproject`, reqBody, reqHeader)
}

//GET PROJECT FOR PROPOSAL CREATION
export const getProjectAPI = async (reqHeader) => {
  return await commonAPI('GET', `${serverURL}/api/getproject`, {}, reqHeader)
}

//CREATE PROPOSAL
export const createProposalAPI = async (reqBody, reqHeader) => {
  return await commonAPI('POST', `${serverURL}/api/createproposal`, reqBody, reqHeader)
}

//GET CLIENT,PROJECTS FOR THE ADD PROPOSAL
export const listProposalAPI = async (reqHeader) => {
  return await commonAPI('GET', `${serverURL}/api/getproposal`, {}, reqHeader)
}

//UPDATE PROPOSALS
export const updatedProposalAPI = async (id, reqBody, reqHeader) => {
  return await commonAPI('PUT', `${serverURL}/api/updateproposal/${id}`, reqBody, reqHeader)
}

//DELETE PROPOSALS
export const deleteProposalAPI = async (id, reqHeader) => {
  return await commonAPI('DELETE', `${serverURL}/api/deleteproposal/${id}`, {}, reqHeader)
}

//GET PROPOSAL STATUS 
export const genereteProposalStatusAPI=async(reqHeader)=>{
  return await commonAPI('GET',`${serverURL}/api/proposalstatus`,{},reqHeader)
}

// GENERATE LINK
export const generateLinkAPI = async (reqBody, reqHeader) => {
  return await commonAPI('POST', `${serverURL}/api/links/generate`, reqBody, reqHeader)
}

// REVOKE LINK
export const revokeLinkAPI = async (reqBody, reqHeader) => {
  return await commonAPI('POST', `${serverURL}/api/links/revoke`, reqBody, reqHeader)
}

//UNREVOKE LINK
export const unrevokeLinkAPI=async (reqBody,reqHeader)=>{
  return await commonAPI('POST',`${serverURL}/api/links/unrevoke`,reqBody,reqHeader)
}

// GET PROPOSAL BY TOKEN
export const getProposalByTokenAPI = async (token) => {
  return await commonAPI('GET', `${serverURL}/api/public/proposal/${token}`, null, null)
}

// VERIFY PASSWORD
export const verifyPasswordAPI = async (reqBody) => {
  return await commonAPI('POST', `${serverURL}/api/public/verify-password`, reqBody, null)
}

//GET LINK BY PROPOSAL
export const getLinkByProposalAPI=async(proposalId,reqHeader)=>{
  return await commonAPI('GET',`${serverURL}/api/links/proposal/${proposalId}`,{},reqHeader)
}

//SUBMITSIGNATURE
export const submitSignatureAPI = async (reqBody,reqHeader) => {
  return await commonAPI('POST', `${serverURL}/api/submitsignature`, reqBody, reqHeader)
} 

//GET AUDITLOGS
export const getAuditLogsAPI=async(reqHeader)=>{
  return await commonAPI('GET',`${serverURL}/api/auditlogs`,{},reqHeader)
}

//GET SIGNATURE BY PROPOSAL
export const getSignatureByProposalAPI = async (proposalId, reqHeader) => {
    return await commonAPI('GET', `${serverURL}/api/signature/${proposalId}`, {}, reqHeader)
}

//UPDATE STATUS TO SENT
export const updateProposalStatusAPI=async(id,reqBody,reqHeader)=>{
  return await commonAPI('PUT',`${serverURL}/api/updatestatus/${id}`,reqBody,reqHeader)
}

// DELETE EMPTY LOGS
export const clearEmptyLogsAPI = async (reqHeader) => {
    return await commonAPI('DELETE', `${serverURL}/api/auditlogs/clear-empty`, {}, reqHeader)
}

//UPDATE ADMIN PROFILE
export const updateAdminProfileAPI=async(reqBody,reqHeader)=>{
  return await commonAPI('PUT',`${serverURL}/api/updateadmin`,reqBody,reqHeader) 
}