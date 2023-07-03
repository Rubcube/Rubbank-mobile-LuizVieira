import { SafeAreaView } from 'react-native-safe-area-context';
import Background from '../../components/Background';
import Container from '../../components/Container';
import { Image, ImageBackground, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { ActiveAccountContext } from '../../services/ActiveAccountContext';
import logoBranco from '../../assets/logo-branco.png'
import wave from '../../assets/wave.png'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import getBalance from '../../services/userAPI';
import MenuItem from '../../components/MenuItem';
import transferIcon from '../../assets/transfers.png';
import extratoIcon from '../../assets/extrato.png'
import userIcon from '../../assets/users.png'
import { StackTypes } from '../../routes/stackNavigation';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../services/AuthContext';

const HomeScreen = () => {
    const navigation = useNavigation<StackTypes>();
    const [activeAccount, setActiveAccount] = useContext(ActiveAccountContext);
    const [auth, setAuth] = useContext(AuthContext);
    const [balanceHide, setBalanceHide] = useState(true);
    const [balance, setBalance] = useState('');

    useEffect(() => {
        fetchData().catch(console.error)
    }, []);

    const fetchData = async () => {
        const response = await getBalance(activeAccount.id, auth);
        const valBalance: number = response.balance * 100 | 0;
        setBalance((valBalance / 100).toFixed(2));
    }

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1, backgroundColor: '#FFFFFF' }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} >
                <Background>
                    <ImageBackground source={wave} resizeMode='contain' style={{ width: '100%', height: 160 }}>
                        <View style={styles.Header}>
                            <View style={styles.topHeader}>
                                <Image source={logoBranco} resizeMode='contain' style={{ height: 30 }} />
                                <View style={styles.icons}>
                                    <Ionicons name='ios-notifications-outline' size={25} color={'#FFFFFF'} />
                                    <Octicons name='question' size={20} color={'#FFFFFF'} />
                                    <Ionicons name='menu' size={30} color={'#FFFFFF'} />
                                </View>
                            </View>
                            <View style={styles.bottomHeader}>
                                <View>
                                    <Text style={{ fontSize: 16, color: '#FFFFFF' }}>Seu saldo</Text>
                                    <Text style={styles.balance}>RC {balanceHide ? '****.**' : balance}</Text>
                                </View>
                                <TouchableOpacity onPress={() => setBalanceHide(!balanceHide)}>
                                    <Ionicons name={balanceHide ? 'eye-off-outline' : 'eye-outline'} size={27} color={'#FFFFFF'} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ImageBackground>
                    <Container style={{ gap: 20 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <MenuItem image={transferIcon} title='Transferir' />
                            <TouchableOpacity onPress={() => navigation.navigate('Extrato')}>
                                <MenuItem image={extratoIcon} title='Extrato' />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={() => navigation.navigate('Perfil')}>
                                <MenuItem image={userIcon} title='Perfil' />
                            </TouchableOpacity>
                        </View>
                    </Container>
                </Background>
            </ScrollView>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    Header: {
        paddingTop: 30,
        paddingRight: 35,
        justifyContent: 'space-between',
        height: '100%',
        paddingBottom: 15,
    },
    topHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    icons: {
        marginTop: -25,
        flexDirection: 'row',
        gap: 20,
        alignItems: 'center'
    },
    bottomHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 25,
        alignItems: 'flex-end'
    },
    balance: {
        fontSize: 24,
        color: '#FFFFFF'
    },
    balanceHidden: {
        fontSize: 24,
        color: '#FFFFFF'
    }
});
export default HomeScreen;
