import { useNavigation, useRoute } from '@react-navigation/native';
import { FlatList, ImageBackground, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Background from '../../components/Background';
import DefaultHeader from '../../components/DefaultHeader';
import wave from '../../assets/wave.png'
import { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../services/AuthContext';
import { ActiveAccountContext } from '../../services/ActiveAccountContext';
import { StackTransferTypes } from '../../routes/stackTransfer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getMessages, getTickets, postMessage } from './services/suportAPI';
import { MessageDTO, TicketDTO } from '../../types/SuportDTO';
import { DateTime } from 'luxon';
import { styled } from 'styled-components';

interface MessageProps {
    isReceived: boolean
}

const ContentMessage = styled(View) <MessageProps>`
    flex-direction: row;
    justify-content: ${props => props.isReceived ? 'flex-start' : 'flex-end'};
`;

const Message = styled(View) <MessageProps>`
    align-self: baseline;
    justify-content: center;
    align-items: ${props => props.isReceived ? 'flex-start' : 'flex-end'};
    margin-top: 20px;
    background-color: ${props => props.isReceived ? '#211F52' : '#6B7AE5'};
    padding: 10px 20px 10px 20px;
    border-radius: 8px;
`;

interface ResponseMessages {
    status: number
    messages?: MessageDTO[]
    error?: string
}

interface routeParams {
    ticketId: string
}

export default function Messages(): JSX.Element {
    const navigation = useNavigation<StackTransferTypes>();
    const [auth, setAuth] = useContext(AuthContext);
    const [activeAccount, setActiveAccount] = useContext(ActiveAccountContext);

    const [messages, setMessages] = useState<MessageDTO[]>([]);
    const [groupedMessages, setGroupedMessages] = useState<MessageDTO[][]>([]);
    const [dateGroups, setDateGroups] = useState<String[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [page, setPage] = useState(1);

    const [atTop, setAtTop] = useState(true);

    const handleViewableItemsChanged = useCallback(({ viewableItems }: any) => {
        const isAtTop = viewableItems.some((item: any) => item.index === 0);
        console.log(isAtTop);
        setAtTop(isAtTop);
    }, []);

    const route = useRoute();
    const { ticketId } = route.params as routeParams;

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, [])

    useEffect(() => {
        const result = groupByDate();
        setGroupedMessages(Object.values(result));
        setDateGroups(Object.keys(result));
    }, [messages])

    const [isOver, setIsOver] = useState(false)

    const fetchData = async () => {
        //console.log(atTop);
        if (!atTop) return;
        const response = await getMessages(auth, ticketId, 1);
        if (response) {
            const resMessages: ResponseMessages = response;
            if (resMessages.status === 200) {
                setMessages(resMessages.messages || [])
            }
        }
        setPage(1)
    }

    const fetchNewMessages = async () => {
        if (!atTop || isOver) return;
        const response = await getMessages(auth, ticketId, page+1);
        if (response) {
            const resMessages: ResponseMessages = response;
            if (resMessages.status === 200) {
                if (resMessages.messages) {
                    if (resMessages.messages.length === 0 || resMessages.messages.length < 10) setIsOver(true);
                    const combinedArray = messages.concat(resMessages.messages)
                    setMessages(combinedArray);
                }
            }
        }
        setPage(page + 1)
    }

    const groupByDate = () => {
        return messages?.reduce((hash: { [key: string]: MessageDTO[] }, obj) => {
            if (obj["created_at"] === undefined) return hash;
            const date = obj['created_at'].substring(0, 10);
            return { ...hash, [date]: (hash[date] || []).concat(obj) };
        }, {});
    };

    const handleChange = (text: string) => {
        setNewMessage(text);
    }

    const onSubmit = async () => {
        setNewMessage('');
        const response = await postMessage(auth, ticketId, newMessage)
        if (response.status === 200) await fetchData();
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Background>
                <ImageBackground source={wave} resizeMode='contain' style={{ width: '100%', height: 160 }}>
                    <DefaultHeader title='Solicitações' backFunction={() => navigation.goBack()} />
                </ImageBackground>
                <View style={styles.Container}>
                    <View style={{ flex: 1, alignSelf: 'stretch', marginTop: 10, gap: 20 }}>

                        <FlatList
                            style={{ paddingHorizontal: 36 }}
                            data={dateGroups}
                            inverted
                            onViewableItemsChanged={handleViewableItemsChanged}
                            viewabilityConfig={{ viewAreaCoveragePercentThreshold: 10 }}
                            renderItem={({ item, index }) => {
                                return (
                                    <>
                                        <FlatList
                                            data={groupedMessages[index]}
                                            inverted
                                            renderItem={({ item, index }) => {
                                                return (
                                                    <ContentMessage isReceived={item.direction === 'received'}>
                                                        <Message isReceived={item.direction === 'received'} style={{ elevation: 2 }}>
                                                            <Text style={{ color: '#FFFFFF', paddingRight: 50 }}>{item.message}</Text>
                                                            <Text style={{ alignSelf: 'flex-end', color: '#FFFFFF', fontSize: 10 }}>
                                                                {DateTime.fromISO(item.created_at).setLocale('pt-br').toLocaleString(DateTime.TIME_24_SIMPLE)}
                                                            </Text>
                                                        </Message>
                                                    </ContentMessage>
                                                )
                                            }}
                                        />
                                        <Text style={styles.dateSeparator}>
                                            {DateTime.fromISO(item as string).hasSame(DateTime.now(), 'day') ?
                                                'Hoje'
                                                : DateTime.fromISO(item as string).setLocale('pt-br').toLocaleString(DateTime.DATE_SHORT)}
                                        </Text>
                                    </>
                                )
                            }}
                            onEndReached={() => { fetchNewMessages(); }}
                            onEndReachedThreshold={0.1}
                        />

                        <View style={styles.messageInput}>
                            <TextInput
                                placeholder='Escrever uma mensagem...'
                                placeholderTextColor={'#383838'}
                                multiline={true}
                                onChangeText={(text) => handleChange(text)}
                                value={newMessage}
                            />
                            <TouchableOpacity onPress={onSubmit}>
                                <MaterialCommunityIcons name='send' color={'#383838'} size={20} />
                            </TouchableOpacity>
                        </View>
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
    messageInput: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        backgroundColor: '#eef0ff',
        paddingHorizontal: 20,
        borderRadius: 15,
        marginHorizontal: 36
    },
    dateSeparator: {
        marginTop: 20,
        textAlign: 'center',
        color: '#AAABAB',
        fontWeight: '500',
        borderBottomWidth: 0.4,
        borderStyle: 'solid',
        borderBottomColor: '#AAABAB',
        paddingBottom: 20
    }
})