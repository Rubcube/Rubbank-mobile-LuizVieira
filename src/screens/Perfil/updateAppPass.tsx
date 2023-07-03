import { SafeAreaView } from 'react-native-safe-area-context';
import Background from '../../components/Background';
import Container from '../../components/Container';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import wave from '../../assets/wave.png'
import DefaultHeader from '../../components/DefaultHeader';
import { useNavigation } from '@react-navigation/native';
import { ActiveAccountContext } from '../../services/ActiveAccountContext';
import { StackPefilTypes } from '../../routes/stackPerfil';
import { UserContext } from '../../services/UserContext';
import { AuthContext } from '../../services/AuthContext';
import { maskCep } from '../../utils/masks';
import InputField from '../../components/InputField';
import { FieldValues, useForm } from 'react-hook-form';
import { passwordValidator } from '../../services/validateFields';
import DefaultButton from '../../components/DefaultButton';
import { LoadingScreen } from '../../components/LoadingScreen';
import ErrorModal from '../../components/ErrorModal';
import SuccessModal from '../../components/SuccessModal';
import InfoModal from '../../components/infoModal';
import Feather from 'react-native-vector-icons/Feather';
import { putAppPass } from './services/userAPI';
import { ErrorDTO } from '../../types/responseDTO';

const UpdateAppPass = () => {
    const navigation = useNavigation<StackPefilTypes>();
    const [auth, setAuth] = useContext(AuthContext);

    const { register, setValue, handleSubmit, watch } = useForm();

    const [isFormValid, setIsFormValid] = useState(false)

    const [errorMsg, setErrorMsg] = useState({
        oldPassword: '',
        password: '',
        confirmPassword: ''
    })

    useEffect(() => {
        register('oldPassword')
        register('password')
        register('confirmPassword')
    }, [register])

    useEffect(() => {
        if (watch('password') && watch('confirmPassword') && watch('oldPassword') &&
            errorMsg.password === '' && errorMsg.confirmPassword === '' && errorMsg.confirmPassword === '') {
            setIsFormValid(true)
        } else {
            setIsFormValid(false)
        }
    }, [errorMsg])

    const validationMap = (field: string) => {
        switch (field) {
            case 'password':
                setErrorMsg({ ...errorMsg, password: passwordValidator(watch('password')) });
                break;
            case 'confirmPassword':
                setErrorMsg({ ...errorMsg, confirmPassword: watch('password') === watch('confirmPassword') ? '' : 'As senhas dever ser iguais' })
                break;
            case 'oldPassword':
                setErrorMsg({ ...errorMsg, oldPassword: passwordValidator(watch('oldPassword'))});
                break;
            default:
                break;
        }
    }

    const onSubmit = async (data: FieldValues) => {
        setLoadingVisibility(true);
        const response = await putAppPass(auth, data.password, data.oldPassword);
        setLoadingVisibility(false);

        if(response === 200){
            setSuccessVisibility(true);
        }else{
            const error = response as ErrorDTO;
            setModalError(error.error[0].message)
        }
    }

    const [infoVisibility, setInfoVisibility] = useState(false);
    const [modalError, setModalError] = useState('');
    const [successVisibility, setSuccessVisibility] = useState(false);
    const [loadingVisibility, setLoadingVisibility] = useState(false);
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <InfoModal actionButton={() => setInfoVisibility(!infoVisibility)} btnText="ENTENDI" visibility={infoVisibility} />
            <LoadingScreen visibility={loadingVisibility} />
            <ErrorModal
                visibility={modalError !== ''}
                errorMsg={modalError}
                setVisibility={() => { setModalError('') }} />
            <SuccessModal
                btnText="CONTINUAR"
                successTitle="Alterações realizadas"
                visibility={successVisibility}
                actionButton={() => { navigation.goBack(); }}
            />
            <Background>
                <ImageBackground source={wave} resizeMode='contain' style={{ width: '100%', height: 160 }}>
                    <DefaultHeader title='Alteração de Senha' backFunction={() => navigation.goBack()} />
                </ImageBackground>
                <Container style={{ gap: 20, marginTop: -80, flex: 1 }}>
                    <ScrollView style={{ flex: 1 }}>
                        <View style={{ gap: 30 }}>
                            <Text style={{ fontSize: 24, fontWeight: '400', textAlign: 'center' }}>
                                Digite qual será sua senha para entrar no aplicativo
                            </Text>
                            <TouchableOpacity style={{ alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 5 }} onPress={() => { setInfoVisibility(!infoVisibility) }}>
                                <Feather name="info" size={12} color={'#00204A'} />
                                <Text style={{ color: "#00204A", fontSize: 12, fontWeight: '700' }}>Como criar uma senha segura</Text>
                            </TouchableOpacity>
                            <InputField
                                fieldName="oldPassword"
                                isRequired={errorMsg.oldPassword !== ''}
                                requireMsg={errorMsg.oldPassword}
                                keyboardType="default"
                                label="Digite sua senha atual:"
                                placeholder=""
                                placeholderTextColor=""
                                secureTextEntry={true}
                                setValue={setValue}
                                validationFunction={() => validationMap('oldPassword')}
                            />
                            <InputField
                                fieldName="password"
                                isRequired={errorMsg.password !== ''}
                                requireMsg={errorMsg.password}
                                keyboardType="default"
                                label="Digite sua nova senha:"
                                placeholder=""
                                placeholderTextColor=""
                                secureTextEntry={true}
                                setValue={setValue}
                                validationFunction={() => validationMap('password')}
                            />
                            <InputField
                                fieldName="confirmPassword"
                                isRequired={errorMsg.confirmPassword !== ""}
                                requireMsg={errorMsg.confirmPassword}
                                keyboardType="default"
                                label="Confirme sua nova senha:*"
                                placeholder=""
                                placeholderTextColor=""
                                secureTextEntry={true}
                                setValue={setValue}
                                validationFunction={() => validationMap('confirmPassword')}
                            />

                            <TouchableOpacity style={{ alignSelf: 'center', marginTop: 20 }} onPress={handleSubmit(onSubmit)} disabled={!isFormValid}>
                                <DefaultButton color={isFormValid ? "#1D1C3E" : "#CCCCCC"} text="CONFIRMAR" />
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
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


export default UpdateAppPass;
