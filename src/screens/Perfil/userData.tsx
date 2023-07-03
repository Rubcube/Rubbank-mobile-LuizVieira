import { SafeAreaView } from 'react-native-safe-area-context';
import Background from '../../components/Background';
import Container from '../../components/Container';
import { ImageBackground, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native';
import { useContext, useEffect } from 'react';
import wave from '../../assets/wave.png'
import DefaultHeader from '../../components/DefaultHeader';
import { useNavigation } from '@react-navigation/native';
import { ActiveAccountContext } from '../../services/ActiveAccountContext';
import { StackPefilTypes } from '../../routes/stackPerfil';
import { UserContext } from '../../services/UserContext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { AuthContext } from '../../services/AuthContext';
import { maskCpf } from '../../utils/masks';

const DataUser = () => {
    const navigation = useNavigation<StackPefilTypes>();
    const [account, setAccount] = useContext(ActiveAccountContext);
    const [auth, setAuth] = useContext(AuthContext);
    const [user, setUser] = useContext(UserContext);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Background>
                <ImageBackground source={wave} resizeMode='contain' style={{ width: '100%', height: 160 }}>
                    <DefaultHeader title='Dados Bancários' backFunction={() => navigation.goBack()} />
                </ImageBackground>
                <Container style={{ gap: 30, marginTop: -80, alignItems: 'center' }}>
                    <View style={{ paddingHorizontal: 20, marginBottom: 10 }}>
                        <Text style={{ fontSize: 16, fontWeight: '400' }}>
                            Use os dados abaixo para fazer uma <Text style={{ fontWeight: '700' }}> TED ou DOC para a sua Conta RubBank</Text>
                        </Text>
                    </View>
                    <View style={styles.item}>
                        <View>
                            <Text style={styles.h2Item}>Agência</Text>
                            <Text style={styles.h1Item}>{account.agency}</Text>
                        </View>
                        <TouchableOpacity style={{alignItems: 'center'}}>
                            <AntDesign name='copy1' size={20} />
                            <Text style={styles.copyText}>Copiar</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.item}>
                        <View>
                            <Text style={styles.h2Item}>Conta</Text>
                            <Text style={styles.h1Item}>{account.account_number}</Text>
                        </View>
                        <TouchableOpacity style={{alignItems: 'center'}}>
                            <AntDesign name='copy1' size={20} />
                            <Text style={styles.copyText}>Copiar</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.item}>
                        <View>
                            <Text style={styles.h2Item}>CPF</Text>
                            <Text style={styles.h1Item}>{maskCpf(user.cpf)}</Text>
                        </View>
                        <TouchableOpacity style={{alignItems: 'center'}}>
                            <AntDesign name='copy1' size={20} />
                            <Text style={styles.copyText}>Copiar</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.item}>
                        <View>
                            <Text style={styles.h2Item}>Favorecido</Text>
                            <Text style={styles.h1Item}>{user.fullName}</Text>
                        </View>
                        <TouchableOpacity style={{alignItems: 'center'}}>
                            <AntDesign name='copy1' size={20} />
                            <Text style={styles.copyText}>Copiar</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.item}>
                        <View>
                            <Text style={styles.h2Item}>Instituição</Text>
                            <Text style={styles.h1Item}>RubBank</Text>
                        </View>
                    </View>
                    <View style={styles.item}>
                        <View>
                            <Text style={styles.h2Item}>Tipo</Text>
                            <Text style={styles.h1Item}>Conta Corrente</Text>
                        </View>
                    </View>
                    <View style={styles.item}>
                        <View>
                            <Text style={styles.h2Item}>Método</Text>
                            <Text style={styles.h1Item}>TED ou DOC</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.button} onPress={() => {}}>
                        <Text style={{ fontSize: 16, color: '#383838', fontWeight: '500' }}>COMPARTILHAR DADOS</Text>
                    </TouchableOpacity>
                </Container>
            </Background>
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'stretch',
        paddingHorizontal: 20,
        alignItems: 'center'
    },
    h1Item: {
        fontSize: 16,
        color: '#383838',
        fontWeight: '400',
    },
    h2Item: {
        fontSize: 12,
        color: '#383838',
        fontWeight: '400',
    },
    copyText: {
        fontSize: 10,
        color: '#6B7AE5'
    },
    button: {
        alignItems: 'center',
        paddingHorizontal: 55,
        paddingVertical: 16,
        borderColor: '#383838',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 30
    }
})


export default DataUser;
