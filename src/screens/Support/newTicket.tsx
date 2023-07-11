import { useNavigation } from '@react-navigation/native';
import { ImageBackground, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Background from '../../components/Background';
import DefaultHeader from '../../components/DefaultHeader';
import wave from '../../assets/wave.png'
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../services/AuthContext';
import { ActiveAccountContext } from '../../services/ActiveAccountContext';
import InputField from '../../components/InputField';
import DefaultButton from '../../components/DefaultButton';
import { FieldValues, useForm } from 'react-hook-form';
import ErrorModal from '../../components/ErrorModal';
import { postTicket } from './services/suportAPI';
import { StackSuportTypes } from '../../routes/stackSuport';

export default function NewTicket(): JSX.Element {
    const navigation = useNavigation<StackSuportTypes>();
    const [auth, setAuth] = useContext(AuthContext);
    const [activeAccount, setActiveAccount] = useContext(ActiveAccountContext);

    const [balance, setBalance] = useState('');
    const { register, setValue, handleSubmit, watch } = useForm();
    const [isFormValid, setIsFormValid] = useState(false);
    const [errorMsg, setErrorMsg] = useState({
        title: '',
        description: ''
    })
    

    useEffect(() => {
        register('title')
        register('description')
    }, [register]);

    useEffect(() => {
        if (watch('title') && watch('description') &&
            errorMsg.title === '' &&
            errorMsg.description === '') {
            setIsFormValid(true);
        } else {
            setIsFormValid(false)
        }
    }, [errorMsg])

    const validationMap = (field: string) => {
        switch (field) {
            case 'title':
                setErrorMsg({ ...errorMsg, title: watch('title') === '' || !watch('title') ? 'Campo Obrigatório' : '' });
                break;
            case 'description':
                setErrorMsg({ ...errorMsg, title: watch('description') === '' || !watch('description') ? 'Campo Obrigatório' : '' });
                break;
            default:
                break;
        }
    }

    const [modalError, setModalError] = useState('');

    const onSubmit = async (data: FieldValues) => {
        const response = await postTicket(auth, data.title, data.description);
        if (response) {
            if (response.status !== 200) setModalError('Não foi possível criar solicitação! tente novamente mais tarde.');
            else navigation.navigate('Tickets')
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ErrorModal
                visibility={modalError !== ''}
                errorMsg={modalError}
                setVisibility={() => { setModalError('') }} />
            <Background>
                <ImageBackground source={wave} resizeMode='contain' style={{ width: '100%', height: 160 }}>
                    <DefaultHeader title='Nova Solicitação' backFunction={() => navigation.goBack()} />
                </ImageBackground>
                <View style={styles.Container}>
                    <ScrollView>
                        <View style={{ flex: 1, backgroundColor: '#FFFFFF', paddingTop: 20, gap: 20 }}>
                            <InputField
                                fieldName='title'
                                isRequired={errorMsg.title !== ''}
                                requireMsg={errorMsg.title}
                                keyboardType='default'
                                label='Título*'
                                placeholder='Digite um título para seu chamado'
                                placeholderTextColor=''
                                secureTextEntry={false}
                                setValue={setValue}
                                validationFunction={() => validationMap('title')}
                            />
                            <InputField
                                fieldName='description'
                                isRequired={errorMsg.description !== ''}
                                requireMsg={errorMsg.description}
                                keyboardType='default'
                                label='Descrição*'
                                placeholder='Descreva o motivo desta solicitação'
                                placeholderTextColor=''
                                secureTextEntry={false}
                                setValue={setValue}
                                validationFunction={() => validationMap('description')}
                                multiline
                            />
                        </View>
                        <TouchableOpacity style={{ alignSelf: 'center', marginTop: 50 }} onPress={handleSubmit(onSubmit)} disabled={!isFormValid}>
                            <DefaultButton color={isFormValid ? '#1D1C3E' : '#AAABAB'} text='CONTINUAR' />
                        </TouchableOpacity>
                    </ScrollView>
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
    }
})