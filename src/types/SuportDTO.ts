export interface TicketDTO {
    id: string
    user_info_id: string
    title: string
    description: string
    status: string
    severity: number
    is_solved: boolean
    created_at: string
    updated_at: string
}

export interface MessageDTO {
    id: string
    message: string
    direction: string
    created_at: string
}