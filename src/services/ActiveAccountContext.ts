import { Dispatch, SetStateAction, createContext } from "react";
import AccountsDTO from "../types/AccountDTO";

const initialState: AccountsDTO = {
    account_number: -1,
    agency: '',
    id: ''
};

const AccountDispatch: Dispatch<SetStateAction<AccountsDTO>> = () => {};

export const ActiveAccountContext = createContext<[AccountsDTO, Dispatch<SetStateAction<AccountsDTO>>]>([initialState, AccountDispatch]);