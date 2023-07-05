import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import { ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Background from '../../components/Background';
import DefaultHeader from '../../components/DefaultHeader';
import wave from '../../assets/wave.png'
import { useContext, useEffect, useState } from 'react';
import getBalance from '../../services/userAPI';
import { AuthContext } from '../../services/AuthContext';
import { ActiveAccountContext } from '../../services/ActiveAccountContext';
import InputField from '../../components/InputField';
import DefaultButton from '../../components/DefaultButton';
import { StackTransferTypes } from '../../routes/stackTransfer';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';

export default function InitialStepTransfer(): JSX.Element {
    const navigation = useNavigation<StackTransferTypes>();

    const [enableMask, setEnableMask] = useState(true);
    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount: 4 });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    const toggleMask = () => setEnableMask((f) => !f);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Background>
                <ImageBackground source={wave} resizeMode='contain' style={{ width: '100%', height: 160 }}>
                    <DefaultHeader title='Transferência' backFunction={() => navigation.goBack()} />
                </ImageBackground>
                <View style={styles.Container}>
                    <View>
                        <Text style={{fontSize: 16, fontWeight: '400'}}>Confirme sua senha transacional</Text>
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
                                    textChild = enableMask ? '•' : symbol;
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
                    <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => navigation.navigate('TransferResume')}>
                        <DefaultButton color='#1D1C3E' text='CONTINUAR' />
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