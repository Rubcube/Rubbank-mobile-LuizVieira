import axios from "axios";
import { AccountInfoDTO } from "../../../types/AccountDTO";
import { UserDTO, UserResumeInfoDTO } from "../../../types/UserDTO";
import { ErrorDTO } from "../../../types/responseDTO";

export const getAccount = async (JWTToken: string, agency: string, accountNumber: string) => {
    const axiosInstance = axios.create({
        baseURL: 'http://10.0.2.2:3344/',
        headers: { token: JWTToken },
    });
    let res: AccountInfoDTO | null = null;
    await axiosInstance.get('/account/', { params: { agency: agency, account: accountNumber } })
        .then((response) => {
            res = {
                ...response.data.account
            }
        })
    return res;
}

export const getUser = async (JWTToken: string): Promise<UserResumeInfoDTO | null> => {
    let res: UserResumeInfoDTO | null = null;
    const axiosInstance = axios.create({
        baseURL: 'http://10.0.2.2:3344/',
        headers: { token: JWTToken }
    });

    await axiosInstance.get('/users')
        .then((response) => {
            res = {
                cpf: response.data.user.cpf,
                email: response.data.user.email,
                fullName: response.data.user.full_name,
                phone: response.data.user.phone
            }
            return res;
        
        }).catch((error) => {
            return res;
        })
    return res;
}