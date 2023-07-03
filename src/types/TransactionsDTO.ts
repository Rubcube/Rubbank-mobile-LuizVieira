export interface Filters {
    startDate?: Date
    endDate?: Date
    accountId: string
    schedule?: boolean
    page?: number
}

export interface TransfersResponseDTO {
    status: number
    pagination: {
        pages: number
        actualPAge: number
        maxPerPage: number
    },
    transfers: TransfersDTO[]
}

export interface TransfersDTO {
    id: string
    schedule_date: Date
    created_at: Date
    value: number
    status: string
    type: string
}

export interface DetailedTransferDTO {
    status: number
    id: string
    value: number
    created_at: Date
    schedule_date: Date
    transferStatus: string
    type: string
    account: Account
    account_receiver: Account
}

interface Account {
    agency: string
    account_number: number
    full_name: string
    cpf: string
}

