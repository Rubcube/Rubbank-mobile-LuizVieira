export interface OnboardingDTO {
    progress: number
    
    fullName: string
    phone: string
    email: string
    birth?: string

    userAuth: {
        cpf: string
        password: string
    }

    address: {
        cep: string
        type?: string
        street: string
        number: string
        complement?: string
        neighborhood: string
        city: string
        state: string
    }

    account: {
        transactionPassword: string
    }
}