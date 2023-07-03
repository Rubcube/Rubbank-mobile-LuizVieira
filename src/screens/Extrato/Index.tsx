import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { Image, ImageBackground, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Background from '../../components/Background';
import DefaultHeader from '../../components/DefaultHeader';
import wave from '../../assets/wave.png'
import { useContext, useEffect, useState } from 'react';
import getBalance from '../../services/userAPI';
import { AuthContext } from '../../services/AuthContext';
import { ActiveAccountContext } from '../../services/ActiveAccountContext';
import Transactions from './transactions';
import { StackTypes } from '../../routes/stackNavigation';
import filterIcon from '../../assets/filter.png'
import { FilterModal } from './filterModal';
import { Filters } from '../../types/TransactionsDTO';
import { ChangeFilterContext, FilterContext } from './services/filtersContext';

const Tab = createMaterialTopTabNavigator();

export default function Extrato(): JSX.Element {
    const navigation = useNavigation<StackTypes>();
    const [balance, setBalance] = useState('');
    const [auth, setAuth] = useContext(AuthContext);
    const [activeAccount, setActiveAccount] = useContext(ActiveAccountContext);
    const [modalIsVisible, setModalIsVisible] = useState(false);

    const [filters, setFilters] = useState<Filters>({
        accountId: activeAccount.id
    })

    const [changeFilter, setChangeFilter] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getBalance(activeAccount.id, auth);
            const valBalance: number = response.balance * 100 | 0;
            setBalance((valBalance / 100).toFixed(2));
        }
        fetchData().catch(console.error)
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ChangeFilterContext.Provider value={[changeFilter, setChangeFilter]}>
                <FilterContext.Provider value={[filters, setFilters]}>
                    <FilterModal
                        visibility={modalIsVisible}
                        setVisibility={() => setModalIsVisible(!modalIsVisible)}
                    />
                    <Background>
                        <ImageBackground source={wave} resizeMode='contain' style={{ width: '100%', height: 160 }}>
                            <DefaultHeader title='Extrato' backFunction={() => navigation.goBack()}
                                secondIcon={<Image source={filterIcon} />} secondFunction={() => setModalIsVisible(!modalIsVisible)} />
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
                                <Tab.Screen name='Tudo'>
                                    {() => <Transactions params={{ type: 'all' }} />}
                                </Tab.Screen>
                                <Tab.Screen name='Entrada'>
                                    {() => <Transactions params={{ type: 'in' }} />}
                                </Tab.Screen>
                                <Tab.Screen name='Saída'>
                                    {() => <Transactions params={{ type: 'out' }} />}
                                </Tab.Screen>
                                <Tab.Screen name='Futuro'>
                                    {() => <Transactions params={{ type: 'all', schedule: true }} />}
                                </Tab.Screen>
                            </Tab.Navigator>
                        </View>
                    </Background>
                </FilterContext.Provider>
            </ChangeFilterContext.Provider>
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
        paddingBottom: 20
    }
})