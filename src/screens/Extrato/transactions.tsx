import { useContext, useEffect, useState } from 'react';
import { FlatList, Image, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Filters, TransfersDTO, TransfersResponseDTO } from '../../types/TransactionsDTO';
import { getTransactions } from './services/transactionsAPI';
import { AuthContext } from '../../services/AuthContext';
import pigIcon from '../../assets/pig.png'
import Transfer from './transfer';
import { ChangeFilterContext, FilterContext } from './services/filtersContext';
import { DateTime } from 'luxon';

interface Params {
    type: string
    schedule?: boolean
}

const Transactions = ({ params, }: { params: Params }) => {
    const [auth, setAuth] = useContext(AuthContext)
    const [transfers, setTransfers] = useState<TransfersDTO[]>([])
    const [groups, setGroups] = useState<string[]>([]);
    const [groupedData, setGroupedData] = useState<TransfersDTO[][]>([[]]);
    const [isOver, setIsOver] = useState(false);
    const [page, setPage] = useState(0);
    const [filters, setFilters] = useContext(FilterContext);
    const [changeFilter, setChangeFilter] = useContext(ChangeFilterContext)

    useEffect(() => {
        fetchData();
    }, [changeFilter])


    useEffect(() => {
        setGroupedData(Object.values(groupByDate()));
        setGroups(Object.keys(groupByDate()))
    }, [transfers])


    const resetList = async () => {
        setPage(1);
        setIsOver(false);
    }

    const fetchData = async () => {
        await resetList();

        const response = await getTransactions({
            accountId: filters.accountId,
            endDate: params.schedule? filters.scheduleEndDate: filters.endDate,
            startDate: params.schedule? filters.scheduleStartDate: filters.startDate,
            page: 1,
            schedule: params.schedule,
            order: filters.order
        }, params.type, auth);
        if (response) {
            if (response.status === 200) {
                const resTransfers = response as TransfersResponseDTO;
                if (resTransfers.transfers.length === 0 || resTransfers.transfers.length < 10) setIsOver(true);
                setTransfers(resTransfers.transfers);
            }
        }
    }

    const fetchNewData = async () => {
        if (isOver) return;

        const response = await getTransactions({
            accountId: filters.accountId,
            endDate: params.schedule? filters.scheduleEndDate: filters.endDate,
            startDate: params.schedule? filters.scheduleStartDate: filters.startDate,
            page: page + 1,
            schedule: params.schedule,
            order: filters.order
        }, params.type, auth);
        if (response) {
            if (response.status === 200) {
                const resTransfers = response as TransfersResponseDTO;
                if (resTransfers.transfers.length === 0 || resTransfers.transfers.length < 10) setIsOver(true);
                const combinedArray = transfers.concat(resTransfers.transfers)
                setTransfers(combinedArray);
            }
        }
        setPage(page + 1);
    }

    const groupByDate = () => {
        return transfers?.reduce((hash: { [key: string]: TransfersDTO[] }, obj) => {
            if (obj["schedule_date"] === undefined) return hash;
            return { ...hash, [obj['schedule_date'].toString()]: (hash[obj['schedule_date'].toString()] || []).concat(obj) };
        }, {});
    };

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            {transfers && transfers.length > 0 ?
                <FlatList
                    //refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    style={{ backgroundColor: '#FFFFFF', paddingHorizontal: 36 }}
                    data={groups}
                    renderItem={({ item, index }) => {
                        return (
                            <>
                                {isOver && index === groups.length - 1 ?
                                    <>
                                        <Text style={{ fontSize: 16, fontWeight: '400', marginTop: 30 }}>{DateTime.fromISO(item).toUTC().setLocale('pt-BR').toLocaleString(DateTime.DATE_FULL)}</Text>
                                        <FlatList
                                            style={{ backgroundColor: '#FFFFFF' }}
                                            data={groupedData[index]}
                                            renderItem={({ item, index }) => { return (<Transfer props={item} />) }}
                                            onEndReached={() => { fetchNewData(); }}
                                            onEndReachedThreshold={0.1}
                                        />
                                        <Text style={{ fontSize: 12, fontWeight: '300', color: '#383838', textAlign: 'center', marginTop: 30, alignItems: 'center', backgroundColor: '#FFFFFF' }}>
                                            Chegamos ao final da lista!
                                        </Text>
                                    </> :
                                    <>
                                        <Text style={{ fontSize: 16, fontWeight: '400', marginTop: 30 }}>{DateTime.fromISO(item).toUTC().setLocale('pt-br').toLocaleString(DateTime.DATE_FULL)}</Text>
                                        <FlatList
                                            style={{ backgroundColor: '#FFFFFF' }}
                                            data={groupedData[index]}
                                            renderItem={({ item, index }) => { return (<Transfer props={item} />) }}
                                            onEndReached={() => { fetchNewData(); }}
                                            onEndReachedThreshold={0.1}
                                        />
                                    </>
                                }
                            </>
                        )
                    }}
                />
                :
                <View style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', gap: 10, paddingBottom: 30 }}>
                    <Image source={pigIcon} />
                    <Text style={{ fontSize: 16, color: '#383838', maxWidth: 150, textAlign: 'center', fontWeight: '300', paddingBottom: 20 }}>
                        Você ainda não possui lançamentos
                    </Text>
                </View>
            }

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

})


export default Transactions;
