import axios from "axios";
import { OnboardingDTO } from "../../../types/OnboardingDTO";
import { responseOnboardingDTO } from "../../../types/responseDTO";
import { regex } from "../../../utils/consts";

const axiosInstance = axios.create({ baseURL: 'http://10.0.2.2:3344/' });

const postOnboarding = async (data: OnboardingDTO, transactionPassword: string): Promise<responseOnboardingDTO> => {
    let res: responseOnboardingDTO = {status: 404}
    await axiosInstance.post('/users/',{
        full_name: data.fullName,
        phone: data.phone,
        email: data.email,
        birth: data.birth,
        user_auth: {
            cpf: data.userAuth.cpf,
            password: data.userAuth.password
        },
        address: {
            cep: data.address.cep,
            street: data.address.street,
            number: data.address.number,
            complement: data.address.complement,
            neighborhood: data.address.neighborhood,
            city: data.address.city,
            state: data.address.state
        },
        account: {
            transaction_password: transactionPassword
        }
    }).then((response) => {
        res = {status: response.status}
    }).catch((error) => {
        res = {
            status: error.response.status,
            error: error.response.data.error
        }
    })
    return res
}

export const verifyExistsCpf = async (cpf: string) => {
    let res: boolean = true;
    await axiosInstance.get('/verify/cpf/'+cpf.replace(regex.replace,''))
    .then((response) => {
        res = response.data.exists
    })
    return res;
}

export const verifyExistsEmail = async (email: string) => {
    let res: boolean = true;
    await axiosInstance.get('/verify/email/'+email)
    .then((response) => {
        res = response.data.exists
    })
    return res;
}

export default postOnboarding;