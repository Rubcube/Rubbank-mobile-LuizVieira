import { SafeAreaView } from 'react-native-safe-area-context';
import Background from '../../components/Background';
import Container from '../../components/Container';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import wave from '../../assets/wave.png'
import DefaultHeader from '../../components/DefaultHeader';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackPefilTypes } from '../../routes/stackPerfil';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../services/AuthContext';
import { getTransfer } from './services/transactionsAPI';
import { DetailedTransferDTO } from '../../types/TransactionsDTO';
import { maskCpf } from '../../utils/masks';
import { DateTime } from 'luxon';

type routeParams = {
    id: string
}

const DetailedTransfer = () => {
    const navigation = useNavigation<StackPefilTypes>();
    const [auth, setAuth] = useContext(AuthContext);
    const [transfer, setTransfer] = useState<DetailedTransferDTO>()

    const route = useRoute();
    const { id } = route.params as routeParams;

    useEffect(() => {
        fetchData().catch();
    }, [])

    const fetchData = async () => {
        const response = await getTransfer(id, auth);
        if (response) {
            if (response.status === 200) {
                const detailed: DetailedTransferDTO = response as DetailedTransferDTO;
                setTransfer({ ...detailed, value: detailed.value * 100 | 0 });
            }
        }
    }

    const mapStatus = () => {
        switch (transfer?.transferStatus) {
            case 'SUCCESSFUL': return 'Sucesso';
            case 'INPROGRESS': return 'Em progresso';
            case 'CANCELED': return 'Cancelada';
            case 'REFOUND': return 'Estornada';
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Background>
                <ImageBackground source={wave} resizeMode='contain' style={{ width: '100%', height: 160 }}>
                    <DefaultHeader title='Transferência' backFunction={() => navigation.goBack()} />
                </ImageBackground>
                <Container style={{ gap: 25, marginTop: -80 }}>
                    <View>
                        <Text style={styles.subTitle}>Enviado de</Text>
                        <Text style={styles.title}>{transfer?.account.full_name}</Text>
                    </View>
                    <View>
                        <Text style={styles.subTitle}>CPF</Text>
                        <Text style={styles.title}>{maskCpf(transfer?.account.cpf || '')}</Text>
                    </View>
                    <View>
                        <Text style={styles.subTitle}>Nome</Text>
                        <Text style={styles.title}>{transfer?.account_receiver.full_name}</Text>
                    </View>
                    <View>
                        <Text style={styles.subTitle}>Agência</Text>
                        <Text style={styles.title}>{transfer?.account_receiver.agency}</Text>
                    </View>
                    <View>
                        <Text style={styles.subTitle}>Conta</Text>
                        <Text style={styles.title}>{transfer?.account_receiver.account_number}</Text>
                    </View>
                    <View>
                        <Text style={styles.subTitle}>Data do pagamento</Text>
                        <Text style={styles.title}>{DateTime.fromISO(transfer?.created_at.toString()||'').setLocale('pt-br').toLocaleString(DateTime.DATETIME_MED)}</Text>
                    </View>
                    <View>
                        <Text style={styles.subTitle}>Status</Text>
                        <Text style={styles.title}>{mapStatus()}</Text>
                    </View>
                    <View>
                        <Text style={styles.subTitle}>Valor do Pagamento</Text>
                        <View style={styles.valueBox}>
                            <Text style={{ fontSize: 14 }}>RC</Text>
                            <Text style={styles.value}>{transfer?.value ? (transfer.value / 100).toFixed(2) : 0.00}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.button} onPress={() => { }}>
                        <Text style={{ fontSize: 16, color: '#383838', fontWeight: '500' }}>COMPARTILHAR DADOS</Text>
                    </TouchableOpacity>
                </Container>
            </Background>
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    title: {
        fontSize: 16,
        fontWeight: '400'
    },
    subTitle: {
        fontSize: 12,
        fontWeight: '400'
    },
    valueBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderColor: '#383838',
        borderBottomWidth: 0.5,
        borderStyle: 'solid',
        paddingBottom: 20
    },
    value: {
        fontSize: 48,
        fontWeight: '400'
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


export default DetailedTransfer;
