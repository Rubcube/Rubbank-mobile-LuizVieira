import axios from "axios";
import { responseLoginDTO } from "../../../types/responseDTO";
import { useEffect } from "react";

const axiosInstance = axios.create({ baseURL: 'http://10.0.2.2:3344/' });

const login = async (cpf: string, password: string) => {
    let res: responseLoginDTO = {status: 0};
    await axiosInstance.post('/users/login/',{
        cpf: cpf,
        password: password
    }).then((response) => {
        res = {
            status: response.status,
            token: response.data.token,
            accounts: response.data.accounts
        }
    }).catch((error) => {
        res = {
            status: error.status,
            error: error.response.data.error
        }
    })
    return res;
}

export default login;