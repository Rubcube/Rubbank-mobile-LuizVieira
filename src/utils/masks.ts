export const maskCpf = (value: string) => {
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/,"$1.$2.$3-$4");
    return value;
}

export const maskData = (value: string) => {
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d{2})(\d{4})/,"$1/$2/$3");
    return value;
}

export const maskPhone = (value: string) => {
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d{4,5})(\d{4})/,"($1) $2-$3");
    return value;
}

export const maskCep = (value: string) => {
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{5})(\d{3})/,"$1-$2");
    return value;
}

export const maskTransactionPassword = (value: string) => {
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{4})/,"$1");
    return value;
}