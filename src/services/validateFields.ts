import { regex } from "../utils/consts"

export const validateCpf = (cpf: string) => {
    cpf = cpf.replace(regex.replace, '');

    if (cpf == '') return false;
    if (cpf.length != 11 ||
        cpf == "00000000000" ||
        cpf == "11111111111" ||
        cpf == "22222222222" ||
        cpf == "33333333333" ||
        cpf == "44444444444" ||
        cpf == "55555555555" ||
        cpf == "66666666666" ||
        cpf == "77777777777" ||
        cpf == "88888888888" ||
        cpf == "99999999999")
        return false;

    let soma = 0;
    let resto;

    for (let i = 0; i < 9; i++)soma += parseInt(cpf.charAt(i)) * (10 - i);
    resto = 11 - (soma % 11);
    if (resto == 10 || resto == 11) resto = 0;
    if (resto != parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++)soma += parseInt(cpf.charAt(i)) * (11 - i);
    resto = 11 - (soma % 11);
    if (resto == 10 || resto == 11) resto = 0;
    if (resto != parseInt(cpf.charAt(10))) return false;

    return true;
}

export const nameValidator = (name: string): string => {
    if (name === "") return 'Campo obrigatório';
    else if (!regex.fullName.test(name)) return 'Digite seu nome completo';
    else return '';
}

export const emailValidator = (email: string) => {
    if (email === "") return 'Campo obrigatório';
    else if (!regex.email.test(email)) return 'Digite um email válido';
    else return '';
}

export const phoneValidator = (phone: string) => {
    if (phone === "") return 'Campo obrigatório';
    else if (!regex.phone.test(phone)) return 'Digite um telefone válido';
    else return '';
}

export const cpfValidator = (cpf: string) => {
    if (!cpf) return 'Campo obrigatório';
    else if (!validateCpf(cpf)) return 'Digite um cpf válido';
    else return '';
}

export const birthValidator = (data: string) => {
    return '';
}

export const streetValidator = (street: string) => {
    if (street === "") return "Campo obrigatório";
    else return '';
}

export const numberValidator = (number: string) => {
    if (number === "") return "Campo obrigatório";
    else return "";
}

export const neighborhoodValidator = (neighborhood: string) => {
    if (neighborhood === "") return "Campo obrigatório";
    else return "";
}

export const cityValidator = (city: string) => {
    if (city === "") return "Campo obrigatório";
    else return "";
}

export const stateValidator = (state: string) => {
    if (state === "") return "Campo obrigatório";
    else return '';
}

export const passwordValidator = (password: string) => {
    if(password === "") return "Campo Obrigatório";
    else if (!regex.password.test(password)) return "Digite uma senha válida (verifique as recomendações)";
    else return '';
}

export const transactionPasswordValidator = (password: string) => {
    if(password === "") return "Campo Obrigatório";
    else if (!regex.transactionPassword.test(password)) return "Digite uma senha válida (verifique as recomendações)";
    else return '';
}