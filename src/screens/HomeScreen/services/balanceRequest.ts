import axios from "axios";
import { responseLoginDTO } from "../../../types/responseDTO";
import AsyncStorage from "@react-native-async-storage/async-storage";



const getBalance = async (account: string) => {
    let res: {
        status: number,
        balance: number
    } = {
        status: 0,
        balance: -1
    };
    const JWTToken = await AsyncStorage.getItem('JWTToken');
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