import axios from "axios";
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // if (error.response?.status === 401) {
    //   if (!error.config.url.includes('/api/adminlogin') &&
    //   !error.config.url.includes('/api/public/verify-password')){
    //      localStorage.removeItem("admin");
    //   localStorage.removeItem("token");
    //   window.location.href = "/";
    //   }
     
    // }
    if (error.response?.status === 401) {
  if (!error.config.url.includes('/api/adminlogin') &&
      !error.config.url.includes('/api/public/verify-password')) {
    localStorage.removeItem("admin");
    localStorage.removeItem("token");
    alert("Session expired, please login again");
    window.location.href = "/";
  }
}
    return Promise.reject(error);
  }
);
const commonAPI = async (httpMethod, url, reqBody, reqHeader) => {
    const reqConfig = {
        method: httpMethod,
        url,
        data: reqBody,
        headers: reqHeader
    }
   
    return await axios(reqConfig).then(res => {
        return res
    })
        .catch(err => {
            return err.response
        })
}
export default commonAPI