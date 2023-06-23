import { Context, Dispatch, SetStateAction, createContext } from "react";
import AccountsDTO from "../types/AccountDTO";

const initialState: AccountsDTO[] = [];

const AccountsDispatch: Dispatch<SetStateAction<AccountsDTO[]>> = () => {};
 
export const  AccountsContext = createContext<[AccountsDTO[], Dispatch<SetStateAction<AccountsDTO[]>>]>([initialState, AccountsDispatch]);

