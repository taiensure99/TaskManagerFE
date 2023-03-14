import axios from "axios";

const api = axios.create(
    {
        baseURL:process.env.REACT_APP_URL_API,
        timeout:10000
    }
);

api.interceptors.response.use(
    (response)=>{
        return response.data
    },
    (error)=>{
        console.log(error);
    }
)

export default api
