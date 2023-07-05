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
import { maskCpf } from '../../utils/masks';
import { getUser } from './services/transferAPI';
import { UserResumeInfoDTO } from '../../types/UserDTO';

interface Account {
    account: AccountInfoDTO
}

export default function TransferResume(): JSX.Element {
    const navigation = useNavigation<StackTransferTypes>();
    const [balance, setBalance] = useState('');
    const [auth, setAuth] = useContext(AuthContext);
    const [activeAccount, setActiveAccount] = useContext(ActiveAccountContext);
    const [user, setUser] = useState<UserResumeInfoDTO>();

    const route = useRoute();
    const {account} = route.params as Account;

    useEffect(() => {
        const fetchData = async () => {
            const response = await getBalance(activeAccount.id, auth);
            const valBalance: number = response.balance * 100 | 0;
            setBalance((valBalance / 100).toFixed(2));

            const userResponse = await getUser(auth);
            if(userResponse){
                setUser(userResponse);
            }
            
        }
        fetchData().catch(console.error)
    }, []);

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
                    <ScrollView style={{flex: 1}}>
                        <View style={{ gap: 30 }}>
                            <View>
                                <Text style={styles.subTitle}>Enviado de</Text>
                                <Text style={styles.title}>{user?.fullName}</Text>
                            </View>
                            <View>
                                <Text style={styles.subTitle}>CPF</Text>
                                <Text style={styles.title}>{maskCpf(user?.cpf || '')}</Text>
                            </View>
                            <View>
                                <Text style={styles.subTitle}>Recebido por</Text>
                                <Text style={styles.title}>{account.user.full_name}</Text>
                            </View>
                            <View>
                                <Text style={styles.subTitle}>Agência</Text>
                                <Text style={styles.title}>{account.agency}</Text>
                            </View>
                            <View>
                                <Text style={styles.subTitle}>Conta</Text>
                                <Text style={styles.title}>{account.account_number}</Text>
                            </View>
                            <View>
                                <Text style={styles.subTitle}>Valor do Pagamento</Text>
                                <View style={styles.valueBox}>
                                    <Text style={{ fontSize: 14 }}>RC</Text>
                                    <TextInput
                                        style={styles.value}
                                    />  
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity style={{ alignSelf: 'center', marginTop: 50 }} onPress={() => navigation.navigate('TransferPassword')}>
                            <DefaultButton color='#1D1C3E' text='CONTINUAR' />
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
        paddingBottom: 50,
        paddingHorizontal: 36,
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
    },
    value: {
        fontSize: 48,
        fontWeight: '400',
        backgroundColor: '#FFFFFF',
        borderColor: '#383838',
        borderBottomWidth: 0.5,
        borderStyle: 'solid',
        flex: 1,
        padding: 20
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