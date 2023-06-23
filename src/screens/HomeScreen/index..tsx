import { SafeAreaView } from 'react-native-safe-area-context';
import Background from '../../components/Background';
import Container from '../../components/Container';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { ActiveAccountContext } from '../../services/ActiveAccountContext';
import logoBranco from '../../assets/logo-branco.png'
import wave from '../../assets/wave.png'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import getBalance from './services/balanceRequest';
import MenuItem from '../../components/MenuItem';

const HomeScreen = () => {
    const [activeAccount, setActiveAccount] = useContext(ActiveAccountContext);
    const [balanceHide, setBalanceHide] = useState(true);
    const [balance, setBalance] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const response = await getBalance(activeAccount.id);
            const valBalance: number = response.balance | 0;
            setBalance(valBalance.toFixed(2));
        }
        fetchData().catch(console.error)
    }, []);

    console.log(balance);
    return (
        <SafeAreaView style={{ flex: 1 }}>
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
                <Container style={{gap: 20}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <MenuItem />
                            <MenuItem />
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <MenuItem />
                        </View>
                </Container>
            </Background>
        </SafeAreaView>
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
