import { Dispatch, SetStateAction, createContext } from "react";
import { UserDTO } from "../types/UserDTO";

export const initialUserState: UserDTO = {
    fullName: '',
    cpf: '',
    email: '', 
    phone: '',
    birth: '',
    address: {
        street: '',
        cep: '',
        city: '',
        complement: '',
        id: '',
        neighborhood: '',
        number: '',
        state: ''
    }
};

const UserDispatch: Dispatch<SetStateAction<UserDTO>> = () => {};

export const UserContext = createContext<[UserDTO, Dispatch<SetStateAction<UserDTO>>]>([initialUserState, UserDispatch]);