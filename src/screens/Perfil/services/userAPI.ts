import axios from "axios";
import { UserDTO } from "../../../types/UserDTO";
import { ErrorDTO } from "../../../types/responseDTO";

const getUser = async (JWTToken: string): Promise<UserDTO | null> => {
    let res: UserDTO | ErrorDTO | null = null;
    const axiosInstance = axios.create({
        baseURL: 'http://10.0.2.2:3344/',
        headers: { token: JWTToken }
    });

    await axiosInstance.get('/users')
        .then((response) => {
            res = {
                status: response.status,
                address: response.data.user.address[0],
                fullName: response.data.user.full_name,
                cpf: response.data.user.cpf,
                birth: response.data.user.birth,
                email: response.data.user.email,
                phone: response.data.user.phone
            }
        }).catch((error) => {
            res = null;
        })

    return res;
}


interface Address {
    cep: string,
    street: string,
    number: string,
    complement: string,
    neighborhood: string,
    city: string,
    state: string
}

export const putAddres = async (JWTToken: string, data: Address, id: string): Promise<ErrorDTO | number> => {
    let res: number | ErrorDTO = 404;
    const axiosInstance = axios.create({
        baseURL: 'http://10.0.2.2:3344/',
        headers: { token: JWTToken }
    });

    await axiosInstance.put('/users/address/' + id, {
        cep: data.cep,
        street: data.street,
        number: data.number,
        complement: data.complement,
        neghborhood: data.neighborhood,
        city: data.city,
        state: data.state
    })
        .then((response) => {
            res = response.status
        }).catch((error) => {
            res = error.response.data.error;
        })

    return res;
}

export const putAppPass = async (JWTToken: string, newPass: string, oldPass: string): Promise<ErrorDTO | number> => {
    let res: number | ErrorDTO = 404;
    const axiosInstance = axios.create({
        baseURL: 'http://10.0.2.2:3344/',
        headers: { token: JWTToken }
    });

    await axiosInstance.put('/users/auth/', {
        oldPassword: oldPass,
        newPassword: newPass
    })
        .then((response) => {
            res = response.status
        }).catch((error) => {
            res = error.response.data;
        })
    return res;
}

export const putTransactionPass = async (JWTToken: string, newPass: string, oldPass: string, account: string): Promise<ErrorDTO | number> => {
    let res: number | ErrorDTO = 404;
    const axiosInstance = axios.create({
        baseURL: 'http://10.0.2.2:3344/',
        headers: { token: JWTToken }
    });

    await axiosInstance.put('/account/'+account, {
        old_transaction_password: oldPass,
        new_transaction_password: newPass
    })
        .then((response) => {
            res = response.status
        }).catch((error) => {
            res = error.response.data;
        })
    return res;
}

export default getUser;
