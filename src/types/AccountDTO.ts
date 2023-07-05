type AccountsDTO = 
  {
    id: string;
    agency: string;
    account_number: number;
  }
;

export interface AccountInfoDTO {
  id: string
  agency: string
  account_number: number
  user : {
    full_name: string
    cpf: string
  }
}

export default AccountsDTO;
