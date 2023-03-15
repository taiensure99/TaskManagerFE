import axios from "axios";
const api = axios.create({
  baseURL: process.env.REACT_APP_URL_API,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  let isLogged = Boolean(localStorage.getItem("token"));
  if (isLogged) {
    let token = localStorage.getItem("token");
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.log(error);
  }
);

export default api;
