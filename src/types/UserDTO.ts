export interface UserDTO {
    fullName: string
    cpf: string
    email: string
    phone: string
    birth: string
    address: AddressDTO
}


interface AddressDTO {
    id: string
    cep: string
    street: string
    number: string
    neighborhood: string
    complement: string
    city: string
    state: string
}