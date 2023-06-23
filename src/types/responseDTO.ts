import AccountsDTO from "./AccountDTO"

export interface responseLoginDTO {
    status: number
    error?: error[]
    token?: string
    accounts?: AccountsDTO[]
}

export interface responseViaCepDTO {
    status: number
    cep?: string
    logradouro?: string
    complemento?: string
    bairro?: string
    localidade?: string
    uf?: string
    erro?: boolean
}

interface error{
    code: string
    message: string
}