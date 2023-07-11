import { useNavigation } from '@react-navigation/native';
import { ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Background from '../../components/Background';
import DefaultHeader from '../../components/DefaultHeader';
import wave from '../../assets/wave.png'
import { useContext } from 'react';
import { AuthContext } from '../../services/AuthContext';
import { ActiveAccountContext } from '../../services/ActiveAccountContext';
import Feather from 'react-native-vector-icons/Feather';
import { StackSuportTypes } from '../../routes/stackSuport';

export default function SuportOptions(): JSX.Element {
    const navigation = useNavigation<StackSuportTypes>();
    const [auth, setAuth] = useContext(AuthContext);
    const [activeAccount, setActiveAccount] = useContext(ActiveAccountContext);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Background>
                <ImageBackground source={wave} resizeMode='contain' style={{ width: '100%', height: 160 }}>
                    <DefaultHeader title='Suporte' backFunction={() => navigation.goBack()} />
                </ImageBackground>
                <View style={styles.Container}>

                    <View style={{ flex: 1, alignSelf: 'stretch', marginTop: 10 }}>
                        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Tickets')}>
                            <Text style={styles.textOption}>Minhas solicitações</Text>
                            <Feather name='chevron-right' size={24} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('NewTicket')}>
                            <Text style={styles.textOption}>Nova solicitação</Text>
                            <Feather name='chevron-right' size={24} />
                        </TouchableOpacity>
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
    }
})