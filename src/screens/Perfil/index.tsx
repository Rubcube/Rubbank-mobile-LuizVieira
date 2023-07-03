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
import Feather from 'react-native-vector-icons/Feather';
import getUser from './services/userAPI';
import { AuthContext } from '../../services/AuthContext';
import { maskCpf } from '../../utils/masks';

const PerfilIndex = () => {
    const navigation = useNavigation<StackPefilTypes>();
    const [account, setAccount] = useContext(ActiveAccountContext);
    const [auth, setAuth] = useContext(AuthContext);
    const [user, setUser] = useContext(UserContext);

    useEffect(() => {

        const fetchData = async () => {
            const user = await getUser(auth);
            if (user) {
                setUser(user);
            }
        }

        fetchData().catch(console.error);
    }, [])

    const getInitials = () => {
        if (user.fullName !== '') {
            const names = user.fullName.split(' ');
            return names[0][0] + names[1][0];
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Background>
                <ImageBackground source={wave} resizeMode='contain' style={{ width: '100%', height: 160 }}>
                    <DefaultHeader title='Perfil' backFunction={() => navigation.goBack()} />
                </ImageBackground>
                <Container style={{ gap: 20, marginTop: -80, alignItems: 'center' }}>
                    <View style={styles.userImage}>
                        <Text style={{ color: '#FFFFFF', fontSize: 24 }}>{getInitials()}</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, fontWeight: '400' }}>{user.fullName}</Text>
                        <Text style={{ fontSize: 10 }}>CPF: {maskCpf(user.cpf)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                        <Text style={{ fontSize: 14, color: '#383838' }}>Conta Digital: 000{account.account_number}</Text>
                        <Feather name='upload' size={14} />
                    </View>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('DataUser')}>
                        <Text style={{ fontSize: 16, color: '#383838', fontWeight: '500' }}>VER DADOS BANCÁRIOS</Text>
                    </TouchableOpacity>
                    <View style={{ flex: 1, alignSelf: 'stretch', marginTop: 10 }}>
                        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('UpdateAppPass')}>
                            <Text style={styles.textOption}>Alterar senha do App</Text>
                            <Feather name='chevron-right' size={24} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('UpdateTransactionPass')}>
                            <Text style={styles.textOption}>Alterar senha Transacional</Text>
                            <Feather name='chevron-right' size={24} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('UpdateAddress')}>
                            <Text style={styles.textOption}>Alterar Endereço</Text>
                            <Feather name='chevron-right' size={24} />
                        </TouchableOpacity>
                    </View>
                </Container>
            </Background>
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    userImage: {
        width: 60,
        height: 60,
        backgroundColor: '#6B7AE5',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30
    },
    button: {
        alignItems: 'center',
        paddingHorizontal: 55,
        paddingVertical: 16,
        borderColor: '#383838',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 30
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 28,
        borderStyle: 'solid',
        borderTopWidth: 0.5,
        borderTopColor: '#AAABAB'
    },
    textOption: {
        fontSize: 16,
        fontWeight: '400'
    }
})


export default PerfilIndex;
