import axios from "axios";

const getBalance = async (account: string, JWTToken: string) => {
    let res: {
        status: number,
        balance: number
    } = {
        status: 0,
        balance: -1
    };
    const axiosInstance = axios.create({
        baseURL: 'http://10.0.2.2:3344/',
        headers: { token: JWTToken }
    });

    await axiosInstance.get('/account/balance/'+account)
    .then((response) => {
        res = {
            status: response.status,
            balance: response.data.balance
        }
    }).catch((error) => {
        res = error;
    })

    return res;
}

export default getBalance;