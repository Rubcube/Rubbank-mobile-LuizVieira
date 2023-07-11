import axios from "axios";
import { MessageDTO, TicketDTO } from "../../../types/SuportDTO";

export const getTickets = async (JWTToken: string, page: number) => {
    let res: {
        status: number
        tickets?: TicketDTO[]
        error?: string
    } | null = null

    const axiosInstance = axios.create({
        baseURL: 'http://10.0.2.2:3344/',
        headers: { token: JWTToken },
    });

    await axiosInstance.get('/users/tickets', { params: { page: page } })
        .then((response) => {
            res = {
                status: response.status,
                tickets: response.data.tickets
            }
        }).catch((error) => {
            res = {
                status: error.status,
                error: error.response.error[0].message
            }
        })

    return res;
}

export const getMessages = async (JWTToken: string, ticketId: string, page: number) => {
    let res: {
        status: number
        messages?: MessageDTO[]
        error?: string
    } | null = null

    const axiosInstance = axios.create({
        baseURL: 'http://10.0.2.2:3344/',
        headers: { token: JWTToken },
    });

    await axiosInstance.get('/users/ticket/messages', { params: { ticketId: ticketId, page: page } })
        .then((response) => {
            res = {
                status: response.status,
                messages: response.data.messages
            }
        }).catch((error) => {
            res = {
                status: error.status,
                error: error.response.error[0].message
            }
        })

    return res;
}

export const postMessage = async (JWTToken: string, ticketId: string, message: string) => {
    let res: { status: number } = { status: 0 };

    const axiosInstance = axios.create({
        baseURL: 'http://10.0.2.2:3344/',
        headers: { token: JWTToken }
    });

    await axiosInstance.post('/users/ticket/message?ticketId=' + ticketId, {
        message: message
    })
        .then((response) => {
            res = {
                status: response.status,
            }
        }).catch((error) => {

            res = {
                status: error.response.status,
            }
        })
    return res;
}

export const postTicket = async (JWTToken: string, title: string, description: string) => {
    let res: { status: number } = { status: 0 };

    const axiosInstance = axios.create({
        baseURL: 'http://10.0.2.2:3344/',
        headers: { token: JWTToken }
    });

    await axiosInstance.post('/users/ticket', {
        title: title,
        description: description
    })
        .then((response) => {
            res = {
                status: response.status,
                //data: response.data.transfer.id
            }
        }).catch((error) => {
            console.log(error)
            res = {
                status: error.response.status,
                //data: error.response.status === 401? error.response.data[0].count : error.response.error[0].code
            }
        })
    return res;
}