import axios from "axios";
import { responseViaCepDTO } from "../types/responseDTO";



const getAddress = async (cep: string) => {
    let res: responseViaCepDTO | undefined;

    const axiosInstance = axios.create({
        baseURL: 'https://viacep.com.br/ws/'
    });

    await axiosInstance.get(cep+'/json/')
    .then((response) => {
        res = {
            ...response.data,
            status: response.status
        }

    }).catch((error) => {
        res = {status: error.status, erro: error}
    })

    return res;
}

export default getAddress;