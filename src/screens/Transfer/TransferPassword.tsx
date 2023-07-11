import { useNavigation, useRoute } from '@react-navigation/native';
import { ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Background from '../../components/Background';
import DefaultHeader from '../../components/DefaultHeader';
import wave from '../../assets/wave.png'
import { useContext, useEffect, useState } from 'react';
import DefaultButton from '../../components/DefaultButton';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import { regex } from '../../utils/consts';
import { postTransfer } from './services/transferAPI';
import { AuthContext } from '../../services/AuthContext';
import { ActiveAccountContext } from '../../services/ActiveAccountContext';
import WrongPassModal from './WrongPassModal';
import { LoadingScreen } from '../../components/LoadingScreen';
import SuccessModal from '../../components/SuccessModal';
import { StackTypes } from '../../routes/stackNavigation';
import { DateTime } from 'luxon';
import ErrorModal from '../../components/ErrorModal';

interface routeParams {
    accountReceiver: string
    value: number
    scheduleDate: string
}

export default function InitialStepTransfer(): JSX.Element {
    const navigation = useNavigation<StackTypes>();
    const [count, setCount] = useState(0);
    const [auth, setAuth] = useContext(AuthContext);
    const [activeAccount, setActiveAccount] = useContext(ActiveAccountContext);

    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount: 4 });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    const [isFormValid, setIsFormValid] = useState(false);

    const route = useRoute();
    const transfer = route.params as routeParams;

    useEffect(() => {
        if (regex.transactionPassword.test(value)) setIsFormValid(true);
        else setIsFormValid(false)
    }, [value])

    useEffect(() => {
        if (count >= 3) {
            setActiveAccount({...activeAccount, status: 'BLOCKED'})
        }
    }, [count])

    const onSubmit = async () => {
        setLoadingVisibility(true);
        const response = await postTransfer(
            auth,
            activeAccount.id,
            transfer.accountReceiver,
            transfer.value, DateTime.fromFormat(transfer.scheduleDate, 'dd/MM/yyyy').toFormat('yyyy-MM-dd'),
            value);
        setLoadingVisibility(false);

        if (response.status === 401) {
            console.log(response);
            setCount(parseInt(response.data));
            setError(true);
            setValue('');

        } else if (response.status === 200) {
            setTransferId(response.data);
            setSuccessVisibility(true);

        } else {
            setModalError(response.data)
        }
    }

    const [error, setError] = useState(false);

    const [successVisibility, setSuccessVisibility] = useState(false);
    const [loadingVisibility, setLoadingVisibility] = useState(false);

    const [modalError, setModalError] = useState('');

    const [transferId, setTransferId] = useState('');
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ErrorModal
                visibility={modalError !== ''}
                errorMsg={modalError}
                setVisibility={() => { setModalError('') }} />
            <SuccessModal
                btnText="ENVIAR COMPROVANTE"
                successTitle="Sua transferência foi enviada com sucesso"
                visibility={successVisibility}
                actionButton={() => {
                    navigation.reset({
                        index: 0,
                        routes: [
                            { name: 'Accounts' },
                            { name: 'HomeScreen' },
                            { name: 'DetailedTransfer', params: { id: transferId } }
                        ]
                    })
                }}
            />
            <LoadingScreen visibility={loadingVisibility} />
            <WrongPassModal count={count} isBlocked={count >= 3} setVisibility={() => setError(false)} visibility={error} />
            <Background>
                <ImageBackground source={wave} resizeMode='contain' style={{ width: '100%', height: 160 }}>
                    <DefaultHeader title='Transferência' backFunction={() => navigation.goBack()} />
                </ImageBackground>
                <View style={styles.Container}>
                    <View>
                        <Text style={{ fontSize: 16, fontWeight: '400' }}>Confirme sua senha transacional</Text>
                        <CodeField
                            ref={ref}
                            {...props}
                            caretHidden={true}
                            value={value}
                            onChangeText={setValue}
                            cellCount={4}
                            rootStyle={styles.codeFieldRoot}
                            keyboardType="number-pad"
                            textContentType="oneTimeCode"
                            renderCell={({ index, symbol, isFocused }) => {
                                let textChild = null;

                                if (symbol) {
                                    textChild = '•';
                                } else if (isFocused) {
                                    textChild = <Cursor />;
                                }

                                return (
                                    <Text
                                        key={index}
                                        style={[styles.cell, isFocused && styles.focusCell]}
                                        onLayout={getCellOnLayoutHandler(index)}>
                                        {textChild}
                                    </Text>
                                );
                            }}
                        />
                    </View>
                    <TouchableOpacity style={{ alignSelf: 'center' }} disabled={!isFormValid} onPress={onSubmit}>
                        <DefaultButton color={isFormValid ? '#1D1C3E' : '#AAABAB'} text='CONTINUAR' />
                    </TouchableOpacity>
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
        marginTop: -80,
        paddingBottom: 50,
        paddingHorizontal: 36,
        justifyContent: 'space-between'
    },
    root: { flex: 1, padding: 20 },
    title: { textAlign: 'center', fontSize: 30 },
    codeFieldRoot: { marginTop: 20, gap: 20 },
    cell: {
        height: 50,
        flex: 1,
        lineHeight: 43,
        fontSize: 42,
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        textAlign: 'center',
    },
    focusCell: {
        borderColor: '#000',
        borderBottomWidth: 2
    },
})