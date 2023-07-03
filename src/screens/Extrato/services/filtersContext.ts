import { Dispatch, SetStateAction, createContext } from "react";
import { Filters } from "../../../types/TransactionsDTO";

const initialFiltersState: Filters = {
    accountId: '',
    endDate: undefined,
    startDate: undefined,
};

const FilterDispatch: Dispatch<SetStateAction<Filters>> = () => {};

export const FilterContext = createContext<[Filters, Dispatch<SetStateAction<Filters>>]>([initialFiltersState, FilterDispatch]);

const ChangeFilterDispatch: Dispatch<SetStateAction<boolean>> = () => {};
export const ChangeFilterContext = createContext<[boolean, Dispatch<SetStateAction<boolean>>]>([false, ChangeFilterDispatch]);
