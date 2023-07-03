import { Image, ImageSourcePropType, StyleSheet, Text, Touchable, TouchableOpacity, View } from "react-native";
import { styled } from "styled-components";
import simbol from '../../assets/simbol.png'
import { TransfersDTO } from "../../types/TransactionsDTO";
import { useNavigation } from "@react-navigation/native";
import { StackTypes } from "../../routes/stackNavigation";
import { DateTime } from "luxon";

const Transfer = ({ props }: { props: TransfersDTO }) => {
    const navigation = useNavigation<StackTypes>();

    const value: number = (props.value * 100) | 0;

    const mapStatus = () => {
        switch (props.status) {
            case 'SUCCESSFUL': return 'Sucesso';
            case 'INPROGRESS': return 'Em progresso';
            case 'CANCELED': return 'Cancelada';
            case 'REFOUND': return 'Estornada';
        }
    }

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate('DetailedTransfer', { id: props.id })}
            style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', gap: 10 }}>
                <Image source={simbol} style={{ marginTop: 5 }} />
                <View>
                    <Text style={{ fontSize: 14, fontWeight: '700', maxWidth: 125 }}>Transferência Entre Contas</Text>
                    <Text style={styles.subText}>{mapStatus()}</Text>
                    {props.status !== 'INPROGRESS' && <Text style={styles.subText}>{DateTime.fromISO(props.created_at.toString()).setLocale('pt-br').toLocaleString(DateTime.TIME_24_SIMPLE)}</Text>}
                </View>
            </View>
            {
                props.type === 'in' ?
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#029D29' }}>
                        RC {(value / 100).toFixed(2)}
                    </Text> :
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#cb0000' }}>
                        - RC {(value / 100).toFixed(2)}
                    </Text>
            }

        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    subText: {
        fontSize: 10,
        color: '#AAABAB',
        fontWeight: '400'
    }
})

export default Transfer;