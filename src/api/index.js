import {jwtDecode} from 'jwt-decode'
import axios from "axios";

const apiRequest = axios.create({
    baseURL:process.env.REACT_APP_BACKEND_URL,
})

apiRequest.interceptors.request.use(  //intercepts all requests, takes 2 functions
    async (request) => {
        //grab auth token from localstorage
        const isLogOut = request.url.split('/').pop() === 'jwtLogOut'
        let accessToken = localStorage.getItem('token')
        //use jwt.decode to grab the info from inside 
        const decoded = jwtDecode(accessToken) // figure out if i can take this from the req
        //if it is expired, make a refresh request
        const expDate = new Date(decoded.exp * 1000)
        if (expDate <= new Date() && !isLogOut) {
            const refreshToken = localStorage.getItem('refresh')
            const decodedRefresh = jwtDecode(refreshToken)
            const refreshExp = new Date(decodedRefresh.exp * 1000)
            if (refreshExp <= new Date()) {
                console.log('need to find some way to navigate back to main')
            }
            //axios call to get new tokens
            const newTokens = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/users/jwtRefresh`,
                {
                    accessToken,
                    refreshToken
                }
            );
            //put tokens in localstorage
            localStorage.setItem("token", "Bearer " + newTokens.data.data)
            localStorage.setItem("refresh", "Bearer " + newTokens.data.refresh)
            //and then use the token to make the request
            accessToken = `Bearer ` + newTokens.data.data
        }
        //add authorization header
        request.headers['Authorization'] = accessToken
        //if not expired, just return request
        return request;
    }, (error) => { //intercepts all requests
        console.log('some error msg');
        return error;
    }

)

export default apiRequest;

// TODO: CONVERT ABOVE CODE TO useAxios HOOK WITH BELOW CODE AS REFERENCE
// import axios, { AxiosError } from 'axios';
// import { useNavigate } from 'react-router-dom';

// const useAxios = () => {
//   const navigate = useNavigate();

//   const instance = axios.create({
//     baseURL: `${import.meta.env.VITE_APP_BASE_URL}/api/v1/`,
//   });

//   instance.interceptors.request.use(
//     async (config) => {
//       // handle config eg-: setting token
//       return config;
//     },
//     (error) => Promise.reject(error),
//   );

//   instance.interceptors.response.use(
//     (response) => response,
//     (error: AxiosError) => {
//       if (error.response?.status === 401) {
//         navigate('/login');
//       }
//       return Promise.reject(error);
//     },
//   );

//   return { instance };
// };

// export default useAxios;

//USE THE FOLLOWING IN OTHER FILES
// const { instance } = useAxios();

// const { data } = await instance.get(`user`);