import axios from "axios";
import { DetailedTransferDTO, Filters, TransfersDTO, TransfersResponseDTO } from "../../../types/TransactionsDTO";
import { ErrorDTO } from "../../../types/responseDTO";


export const getTransactions = async (filters: Filters, type: string, JWTToken: string): Promise<TransfersResponseDTO | ErrorDTO | null> => {
    let res: TransfersResponseDTO | ErrorDTO | null = null;
    const axiosInstance = axios.create({
        baseURL: 'http://10.0.2.2:3344/',
        headers: { token: JWTToken },
    });

    await axiosInstance.get('/account/transfer/extrato', { params: {...filters, type: type} })
        .then((response) => {
            const resTransfer: TransfersResponseDTO = {
                status: response.status,
                ...response.data
            }
            res = resTransfer;
        }).catch((error) => {
            const errorResponse: ErrorDTO = {
                status: error.status,
                error: error.response.error
            }
            res = errorResponse;
        })

    return res;
}

export const getTransfer = async (id: string, JWTToken: string): Promise<DetailedTransferDTO | ErrorDTO | null> => {
    let res: DetailedTransferDTO | ErrorDTO | null = null;
    const axiosInstance = axios.create({
        baseURL: 'http://10.0.2.2:3344/',
        headers: { token: JWTToken },
    });

    await axiosInstance.get('/account/transfer/', { params: { id: id } })
        .then((response) => {
            const resTransfer: DetailedTransferDTO = {
                ...response.data.transfer,
                status: response.status,
                transferStatus: response.data.transfer.status
            }
            res = resTransfer;
        }).catch((error) => {
            const errorResponse: ErrorDTO = {
                status: error.status,
                error: error.response.error
            }
            res = errorResponse;
        })

    return res;
}
