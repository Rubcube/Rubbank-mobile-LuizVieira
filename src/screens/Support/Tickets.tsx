import { useNavigation } from '@react-navigation/native';
import { FlatList, ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Background from '../../components/Background';
import DefaultHeader from '../../components/DefaultHeader';
import wave from '../../assets/wave.png'
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../services/AuthContext';
import { ActiveAccountContext } from '../../services/ActiveAccountContext';
import { getTickets } from './services/suportAPI';
import { TicketDTO } from '../../types/SuportDTO';
import { DateTime } from 'luxon';
import { StackSuportTypes } from '../../routes/stackSuport';

interface ResponseTickets {
    status: number
    tickets?: TicketDTO[]
    error?: string
}

export default function Tickets(): JSX.Element {
    const navigation = useNavigation<StackSuportTypes>();
    const [auth, setAuth] = useContext(AuthContext);
    const [activeAccount, setActiveAccount] = useContext(ActiveAccountContext);

    const [tickets, setTickets] = useState<TicketDTO[]>([]);

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        const response = await getTickets(auth, 1);
        if (response) {
            const resTickets: ResponseTickets = response;
            if (resTickets.status === 200) {
                setTickets(resTickets.tickets || [])
            }
        }
    }

    const mapStatus = (status: string) => {
        switch (status) {
            case 'TODO': return 'Não visualizado';
            case 'DOING': return 'Em andamento';
            case 'DONE': return 'Encerrado';
            case 'INREVIEW': return 'Em revisão'
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Background>
                <ImageBackground source={wave} resizeMode='contain' style={{ width: '100%', height: 160 }}>
                    <DefaultHeader title='Solicitações' backFunction={() => navigation.goBack()} />
                </ImageBackground>
                <View style={styles.Container}>
                    <View style={{ flex: 1, alignSelf: 'stretch', marginTop: 10 }}>
                        <FlatList
                            style={{ gap: 20 }}
                            data={tickets}
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Messages', {ticketId: item.id})}>
                                        <Text style={{fontSize: 10, color: '#383838', textAlign: 'right'}}>{mapStatus(item.status)}</Text>
                                        <Text style={{ fontSize: 16, fontWeight: '700' }}>{item.title}</Text>
                                        <Text style={{ fontSize: 14, fontWeight: '400', color: '#383838' }}>{item.description}</Text>
                                        <Text style={{ fontSize: 12, fontWeight: '400', color: '#383838', textAlign: 'right' }}>
                                            {DateTime.fromISO(item.created_at).setLocale('pt-br').toLocaleString(DateTime.DATETIME_SHORT)}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            }}
                        />
                    </View>
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
        marginTop: -80,
        paddingBottom: 20,
        paddingHorizontal: 36
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 28,
        borderStyle: 'solid',
        borderBottomWidth: 0.5,
        borderBottomColor: '#AAABAB'
    },
    textOption: {
        fontSize: 16,
        fontWeight: '400'
    },
    card: {
        backgroundColor: '#FFFFFF',
        elevation: 4,
        flex: 1,
        marginBottom: 10,
        padding: 20,
        gap: 10,
        borderRadius: 5
    }
})