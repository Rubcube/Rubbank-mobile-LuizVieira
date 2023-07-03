import { Dispatch, SetStateAction, createContext } from "react";

const initialState: string = '';

const AuthDispatch: Dispatch<SetStateAction<string>> = () => {};

export const AuthContext = createContext<[string, Dispatch<SetStateAction<string>>]>([initialState, AuthDispatch]);