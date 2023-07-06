import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import { ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Background from '../../components/Background';
import DefaultHeader from '../../components/DefaultHeader';
import wave from '../../assets/wave.png'
import { useContext, useEffect, useState } from 'react';
import getBalance from '../../services/userAPI';
import { AuthContext } from '../../services/AuthContext';
import { ActiveAccountContext } from '../../services/ActiveAccountContext';
import InputField from '../../components/InputField';
import DefaultButton from '../../components/DefaultButton';
import { StackTransferTypes } from '../../routes/stackTransfer';
import { FieldValues, useForm } from 'react-hook-form';
import { getAccount } from './services/transferAPI';
import ErrorModal from '../../components/ErrorModal';
import { AccountInfoDTO } from '../../types/AccountDTO';

const Tab = createMaterialTopTabNavigator();

export default function InitialStepTransfer(): JSX.Element {
    const navigation = useNavigation<StackTransferTypes>();
    const [auth, setAuth] = useContext(AuthContext);
    const [activeAccount, setActiveAccount] = useContext(ActiveAccountContext);

    const [balance, setBalance] = useState('');
    const { register, setValue, handleSubmit, watch } = useForm();
    const [isFormValid, setIsFormValid] = useState(false);
    const [errorMsg, setErrorMsg] = useState({
        agency: '',
        accountNumber: ''
    })

    useEffect(() => {
        register('agency')
        register('account_number')
    }, [register]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getBalance(activeAccount.id, auth);
            const valBalance: number = response.balance * 100 | 0;
            setBalance((valBalance / 100).toFixed(2));
        }
        fetchData().catch(console.error)
    }, []);

    useEffect(() => {
        if (watch('agency') && watch('account_number') &&
            errorMsg.agency === '' &&
            errorMsg.accountNumber === '') {
            setIsFormValid(true);
        } else {
            setIsFormValid(false)
        }
    }, [errorMsg])

    const validationMap = (field: string) => {
        switch (field) {
            case 'agency':
                setErrorMsg({ ...errorMsg, agency: watch('agency') === '' || !watch('agency') ? 'Campo Obrigatório' : '' });
                break;
            case 'account_number':
                setErrorMsg({ ...errorMsg, accountNumber: watch('account_number') === '' || !watch('account_number') ? 'Campo Obrigatório' : '' });
                break;
            default:
                break;
        }
    }
    const onSubmit = async (data: FieldValues) => {
        const response: AccountInfoDTO | null = await getAccount(auth, data.agency, data.account_number);
        if (response) {
            const account: AccountInfoDTO = response;
            if (account.id) {
                if(account.id === activeAccount.id) setModalError('Conta inválida! não é possível fazer uma transferência com origem e destino iguais.');
                else navigation.navigate('TransferResume', {account: account});
            } else setModalError('Conta não encontrada, por favor insira uma conta existente!');
        } else setModalError('Conta não encontrada, por favor insira uma conta existente!');
    }

    const [modalError, setModalError] = useState('');

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ErrorModal
                visibility={modalError !== ''}
                errorMsg={modalError}
                setVisibility={() => { setModalError('') }} />
            <Background>
                <ImageBackground source={wave} resizeMode='contain' style={{ width: '100%', height: 160 }}>
                    <DefaultHeader title='Transferência' backFunction={() => navigation.goBack()} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 36 }}>
                        <Text style={{ fontSize: 14, color: "#FFFFFF", fontWeight: '600' }}>Saldo disponível</Text>
                        <Text style={{ fontSize: 18, color: "#FFFFFF", fontWeight: '800' }}>RC {balance}</Text>
                    </View>
                </ImageBackground>
                <View style={styles.Container}>

                    <Tab.Navigator screenOptions={{
                        tabBarActiveTintColor: '#6B7AE5',
                        tabBarInactiveTintColor: '#383838',
                        tabBarPressColor: '#FFFFFF',
                        tabBarLabelStyle: { textTransform: 'none', fontSize: 16, fontWeight: '500' },
                        tabBarIndicatorStyle: { backgroundColor: '#6B7AE5' },
                        tabBarStyle: { elevation: 0, borderBottomColor: '#AAABAB', borderBottomWidth: 0.4 }
                    }}>
                        <Tab.Screen name='Número da Conta'>
                            {() =>

                                <View style={{ flex: 1, backgroundColor: '#FFFFFF', paddingTop: 20, gap: 20 }}>
                                    <InputField
                                        fieldName='agency'
                                        isRequired={errorMsg.agency !== ''}
                                        requireMsg={errorMsg.agency}
                                        keyboardType='numeric'
                                        label='Agência'
                                        placeholder=''
                                        placeholderTextColor=''
                                        secureTextEntry={false}
                                        setValue={setValue}
                                        maxLength={4}
                                        validationFunction={() => validationMap('agency')}
                                    />
                                    <InputField
                                        fieldName='account_number'
                                        isRequired={errorMsg.accountNumber !== ''}
                                        requireMsg={errorMsg.accountNumber}
                                        keyboardType='numeric'
                                        label='Conta'
                                        placeholder=''
                                        placeholderTextColor=''
                                        secureTextEntry={false}
                                        setValue={setValue}
                                        validationFunction={() => validationMap('account_number')}
                                    />

                                </View>
                            }
                        </Tab.Screen>
                    </Tab.Navigator>
                    <TouchableOpacity style={{ alignSelf: 'center' }} onPress={handleSubmit(onSubmit)} disabled={!isFormValid}>
                        <DefaultButton color={isFormValid ? '#1D1C3E' : '#AAABAB'} text='CONTINUAR' />
                    </TouchableOpacity>
                </View>
            </Background>
        </SafeAreaView >

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
        paddingHorizontal: 36
    }
})