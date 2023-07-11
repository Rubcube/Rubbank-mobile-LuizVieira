import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Background from '../../components/Background';
import DefaultHeader from '../../components/DefaultHeader';
import wave from '../../assets/wave.png'
import { useContext, useEffect, useState } from 'react';
import getBalance from '../../services/userAPI';
import { AuthContext } from '../../services/AuthContext';
import { ActiveAccountContext } from '../../services/ActiveAccountContext';
import DefaultButton from '../../components/DefaultButton';
import { TextInput } from 'react-native-paper';
import { StackTransferTypes } from '../../routes/stackTransfer';
import { AccountInfoDTO } from '../../types/AccountDTO';
import { maskCpf, maskData, maskHiddenCpf } from '../../utils/masks';
import { getUser } from './services/transferAPI';
import { UserResumeInfoDTO } from '../../types/UserDTO';
import { FieldValues, useForm } from 'react-hook-form';
import InputField, { RequireMsg } from '../../components/InputField';
import { DateTime } from 'luxon';

interface Account {
    account: AccountInfoDTO
}

export default function TransferResume(): JSX.Element {
    const navigation = useNavigation<StackTransferTypes>();
    const [balance, setBalance] = useState('');
    const [auth, setAuth] = useContext(AuthContext);
    const [activeAccount, setActiveAccount] = useContext(ActiveAccountContext);
    const [user, setUser] = useState<UserResumeInfoDTO>();

    const { register, setValue, handleSubmit, watch } = useForm();
    const [isFormValid, setIsFormValid] = useState(false);
    const [errorMsg, setErrorMsg] = useState({
        value: '',
        date: ''
    })

    const [field, setField] = useState('');

    const route = useRoute();
    const { account } = route.params as Account;

    useEffect(() => {
        const fetchData = async () => {
            const response = await getBalance(activeAccount.id, auth);
            const valBalance: number = response.balance * 100 | 0;
            setBalance((valBalance / 100).toFixed(2));

            const userResponse = await getUser(auth);
            if (userResponse) {
                setUser(userResponse);
            }
        }
        fetchData().catch(console.error)
    }, []);

    useEffect(() => {
        register('value')
        register('date')

        setValue('date', DateTime.now().toFormat('dd/MM/yyyy').toString())
    }, [register])

    useEffect(() => {
        if (watch('value') && errorMsg.value === '' && watch('date') && errorMsg.date === '') setIsFormValid(true);
        else setIsFormValid(false);
    }, [errorMsg, watch('value')])

    const dateValidation = (value: string) => {
        if (value === '') {
            setValue('date', DateTime.now().toFormat('dd/MM/yyyy').toString());
            setErrorMsg({ ...errorMsg, date: '' });
            return;
        }

        const date = DateTime.fromFormat(value, 'dd/MM/yyyy');
        if (!date.isValid) setErrorMsg({ ...errorMsg, date: 'Digite uma data válida' });
        else if (date.startOf('day') < DateTime.now().startOf('day')) setErrorMsg({ ...errorMsg, date: 'Digite uma data válida' });
        else setErrorMsg({ ...errorMsg, date: '' });
    }

    const handleChange = (text: string) => {
        text = text.replace(',', '.');

        const value: number = parseFloat(text);
        if (Number.isNaN(value) || value <= 0) setErrorMsg({ ...errorMsg, value: 'Digite um valor válido' });
        else if (value > parseFloat(balance) ) setErrorMsg({...errorMsg, value: 'Saldo insuficiente'});
        else setErrorMsg({ ...errorMsg, value: '' });
        setValue('value', text);
        setField(text);
    }

    const onSubmit = (data: FieldValues) => {
        navigation.navigate('TransferPassword', { accountReceiver: account.id, value: parseFloat(data.value), scheduleDate: data.date });
    }


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Background>
                <ImageBackground source={wave} resizeMode='contain' style={{ width: '100%', height: 160 }}>
                    <DefaultHeader title='Transferência' backFunction={() => navigation.goBack()} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 36 }}>
                        <Text style={{ fontSize: 14, color: "#FFFFFF", fontWeight: '600' }}>Saldo disponível</Text>
                        <Text style={{ fontSize: 18, color: "#FFFFFF", fontWeight: '800' }}>RC {balance}</Text>
                    </View>
                </ImageBackground>
                <View style={styles.Container}>
                    <ScrollView style={{ flex: 1, paddingHorizontal: 36 }}>
                        <View style={{ gap: 25 }}>
                            <View>
                                <Text style={styles.subTitle}>Origem: </Text>
                                <Text style={styles.title}>{user?.fullName}</Text>
                            </View>
                            <View>
                                <Text style={styles.subTitle}>CPF</Text>
                                <Text style={styles.title}>{maskCpf(user?.cpf || '')}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', gap: 20 }}>
                                <View>
                                    <Text style={styles.subTitle}>Agência</Text>
                                    <Text style={styles.title}>{activeAccount.agency}</Text>
                                </View>
                                <View>
                                    <Text style={styles.subTitle}>Conta</Text>
                                    <Text style={styles.title}>{activeAccount.account_number}</Text>
                                </View>
                            </View>
                            <View>
                                <Text style={styles.subTitle}>Destino: </Text>
                                <Text style={styles.title}>{account.user.full_name}</Text>
                            </View>
                            <View>
                                <Text style={styles.subTitle}>CPF</Text>
                                <Text style={styles.title}>{maskHiddenCpf(account.user.cpf || '')}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', gap: 20 }}>
                                <View>
                                    <Text style={styles.subTitle}>Agência</Text>
                                    <Text style={styles.title}>{account.agency}</Text>
                                </View>
                                <View>
                                    <Text style={styles.subTitle}>Conta</Text>
                                    <Text style={styles.title}>{account.account_number}</Text>
                                </View>
                            </View>
                            <InputField
                                fieldName='date'
                                isRequired={errorMsg.date !== ''}
                                requireMsg={errorMsg.date}
                                keyboardType='number-pad'
                                label='Data de transferência'
                                placeholder={DateTime.now().toFormat('dd/MM/yyyy').toString()}
                                placeholderTextColor=''
                                secureTextEntry={false}
                                setValue={setValue}
                                mask={maskData}
                                maxLength={10}
                                validationFunction={() => dateValidation(watch('date'))}
                            />
                            <View>
                                <Text style={styles.subTitle}>Valor do Pagamento</Text>
                                <View style={styles.valueBox}>
                                    <Text style={{ fontSize: 14 }}>RC</Text>
                                    <TextInput
                                        style={styles.value}
                                        placeholder='0.00'
                                        placeholderTextColor={'#383838'}
                                        keyboardType='number-pad'
                                        onChangeText={(text) => handleChange(text)}
                                        value={field}
                                        activeUnderlineColor='rgba(0,0,0,0)'
                                        underlineColor='rgba(0,0,0,0)'
                                    />
                                </View>
                                <RequireMsg isRequired={errorMsg.value !== ''}>{errorMsg.value}</RequireMsg>
                            </View>
                        </View>
                        <TouchableOpacity style={{ alignSelf: 'center', marginTop: 50 }} disabled={!isFormValid} onPress={handleSubmit(onSubmit)}>
                            <DefaultButton color={isFormValid ? '#1D1C3E' : '#AAABAB'} text='CONTINUAR' />
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </Background>
        </SafeAreaView>

    );

}

const styles = StyleSheet.create({
    Container: {
        backgroundColor: "#FFFFFF",
        flex: 1,
        paddingTop: 32,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        marginTop: -30,
        paddingBottom: 20,
        gap: 25,
    },
    title: {
        fontSize: 16,
        fontWeight: '400',
        color: '#383838'
    },
    subTitle: {
        fontSize: 12,
        fontWeight: '400',
        color: '#383838'
    },
    valueBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderColor: '#383838',
        borderBottomWidth: 0.5,
        borderStyle: 'solid',
    },
    value: {
        fontSize: 48,
        fontWeight: '400',
        backgroundColor: '#FFFFFF',
        flex: 1,
        paddingHorizontal: 5,
        paddingVertical: 20,
    },
    button: {
        alignItems: 'center',
        paddingHorizontal: 55,
        paddingVertical: 16,
        borderColor: '#383838',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 30,
        marginTop: 20
    }
})