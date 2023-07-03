import AccountsDTO from "./AccountDTO"

export interface responseLoginDTO {
    status: number
    error?: error[]
    token?: string
    accounts?: AccountsDTO[]
}

export interface responseOnboardingDTO {
    status: number
    error?: error[]
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

export interface ErrorDTO {
    status: number
    error: error[]
}

interface error{
    code: string
    message: string
}