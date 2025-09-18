import axios from "axios";
import { BASE_URL_BE } from "../config/ENV";

const Axios = axios.create({
    baseURL: BASE_URL_BE,
    headers : {
        "Content-Type" : "application/json"
    },
    withCredentials: true,
})

export default Axios