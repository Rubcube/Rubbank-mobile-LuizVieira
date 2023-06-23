import { Dispatch, SetStateAction, createContext } from "react";
import { OnboardingDTO } from "../types/OnboardingDTO";

export const initialOnboardingState: OnboardingDTO = {
    progress: 0.20,

    fullName: '',
    phone: '',
    email: '',
    birth: '',

    userAuth: {
        cpf: '',
        password: '',
    },

    address: {
        cep: '',
        type: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
    },

    account: {
        transactionPassword: ''
    }
};

const onboardingDispatch: Dispatch<SetStateAction<OnboardingDTO>> = () => {};

export const OnboadingContext = createContext<[OnboardingDTO, Dispatch<SetStateAction<OnboardingDTO>>]>([initialOnboardingState, onboardingDispatch]);