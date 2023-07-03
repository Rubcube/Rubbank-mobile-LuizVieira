import { SafeAreaView } from 'react-native-safe-area-context';
import Background from '../../components/Background';
import Container from '../../components/Container';
import { ImageBackground, ScrollView, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import wave from '../../assets/wave.png'
import DefaultHeader from '../../components/DefaultHeader';
import { useNavigation } from '@react-navigation/native';
import { ActiveAccountContext } from '../../services/ActiveAccountContext';
import { StackPefilTypes } from '../../routes/stackPerfil';
import { UserContext } from '../../services/UserContext';
import Feather from 'react-native-vector-icons/Feather';
import getUser, { putAddres } from './services/userAPI';
import { AuthContext } from '../../services/AuthContext';
import { maskCep, maskCpf } from '../../utils/masks';
import InputField from '../../components/InputField';
import { FieldValue, FieldValues, useForm } from 'react-hook-form';
import { cityValidator, neighborhoodValidator, numberValidator, stateValidator, streetValidator } from '../../services/validateFields';
import DefaultButton from '../../components/DefaultButton';
import { ErrorDTO, responseViaCepDTO } from '../../types/responseDTO';
import getAddress from '../../services/viaCepApi';
import { LoadingScreen } from '../../components/LoadingScreen';
import ErrorModal from '../../components/ErrorModal';
import SuccessModal from '../../components/SuccessModal';

const UpdateAddress = () => {
    const navigation = useNavigation<StackPefilTypes>();
    const [account, setAccount] = useContext(ActiveAccountContext);
    const [auth, setAuth] = useContext(AuthContext);
    const [user, setUser] = useContext(UserContext);

    const { register, setValue, handleSubmit, watch, getValues } = useForm();

    const [isFormValid, setIsFormValid] = useState(false);
    const [enableExtraFields, setEnableExtraFields] = useState(false);
    const [loadingVisibility, setLoadingVisibility] = useState(false);

    const [errorMsg, setErrorMsg] = useState({
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: '',
        cep: ''
    })

    const [cepValues, setCepValues] = useState({
        street: user.address.street,
        neighborhood: user.address.neighborhood,
        city: user.address.city,
        state: user.address.state
    })

    useEffect(() => {
        setValue('number', user.address.number);
        setValue('complement', user.address.complement);
        setValue('street', user.address.street);
        setValue('neighborhood', user.address.neighborhood);
        setValue('city', user.address.city);
        setValue('state', user.address.state);

        register('cep')
        register('street')
        register('number')
        register('complement')
        register('neighborhood')
        register('city')
        register('state')
    }, [register]);

    useEffect(() => {
        const cep: string = watch('cep');
        if (cep && cep.length === 9) {
            getDataCep();
        }
    }, [watch('cep')])

    useEffect(() => {
        if (watch('street') && watch('number') && watch('neighborhood') && watch('city') && watch('state') && watch('cep') &&
            errorMsg.street === '' &&
            errorMsg.number === '' &&
            errorMsg.neighborhood === '' &&
            errorMsg.city === '' &&
            errorMsg.state === '' && errorMsg.cep === '' && existsChanges()) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false)
        }
    }, [errorMsg]);

    const existsChanges = (): boolean => {
        if (watch('street') !== user.address.street ||
            watch('number') !== user.address.number ||
            watch('neighborhood') !== user.address.neighborhood ||
            watch('city') !== user.address.city ||
            watch('state') !== user.address.state ||
            watch('cep') !== user.address.cep ||
            watch('complement') !== user.address.complement){
            return true;
        }
        return false;
    }

    const getDataCep = async () => {
        setLoadingVisibility(true);
        const response: responseViaCepDTO | undefined = await getAddress(watch('cep'));
        setLoadingVisibility(false);
        if (response?.erro || !response) setErrorMsg({ ...errorMsg, cep: 'Digite um CEP válido' });
        else {
            setErrorMsg({ ...errorMsg, cep: '' });
            if (response?.logradouro !== '' || response.bairro !== '') {
                setEnableExtraFields(false)
            } else {
                setEnableExtraFields(true);
            }
            setCepValues({
                city: response.localidade ? response.localidade : '',
                state: response.uf ? response.uf : '',
                street: response.logradouro ? response.logradouro : '',
                neighborhood: response.bairro ? response.bairro : ''
            });

            setValue('street', cepValues.street);
            setValue('neighborhood', cepValues.neighborhood);
            setValue('city', cepValues.city);
            setValue('state', cepValues.state);

        }
    }

    const validationMap = (field: string) => {
        switch (field) {
            case 'street':
                setErrorMsg({ ...errorMsg, street: streetValidator(watch('street')) });
                break;
            case 'number':
                setErrorMsg({ ...errorMsg, number: numberValidator(watch('number')) });
                break;
            case 'neighborhood':
                setErrorMsg({ ...errorMsg, neighborhood: neighborhoodValidator(watch('neighborhood')) });
                break;
            case 'city':
                setErrorMsg({ ...errorMsg, city: cityValidator(watch('city')) });
                break;
            case 'state':
                setErrorMsg({ ...errorMsg, state: stateValidator(watch('state')) });
                break;
            case 'complement':
                setErrorMsg({...errorMsg});
                break;
            default:
                break;
        }
    }

    const onSubmit = async (data: FieldValues) => {
        const address = {
            cep: data.cep,
            street: data.street,
            number: data.number,
            complement: data.complement? data.complement: ' ',
            neighborhood: data.neighborhood,
            city: data.city,
            state: data.state
        }
        setLoadingVisibility(true);
        const response = await putAddres(auth, address, user.address.id);
        setLoadingVisibility(false);

        if(response === 200){
            setSuccessVisibility(true);
            setUser({...user, address: {...user.address, ...address}})
        }else{
            const error = response as ErrorDTO;
            setModalError(error.error[0].message)
        }
    }

    const [modalError, setModalError] = useState('');
    const [successVisibility, setSuccessVisibility] = useState(false);
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <LoadingScreen visibility={loadingVisibility} />
            <ErrorModal
                visibility={modalError !== ''}
                errorMsg={modalError}
                setVisibility={() => {setModalError('')}} />
            <SuccessModal 
                btnText="CONTINUAR"
                successTitle="Alterações realizadas"
                visibility={successVisibility}
                actionButton={() => {navigation.goBack();}}
            />
            <Background>
                <ImageBackground source={wave} resizeMode='contain' style={{ width: '100%', height: 160 }}>
                    <DefaultHeader title='Alteração de Endereço' backFunction={() => navigation.goBack()} />
                </ImageBackground>
                <Container style={{ gap: 20, marginTop: -80, flex: 1 }}>
                    <ScrollView style={{ flex: 1 }}>
                        <View style={{ gap: 30 }}>
                            <InputField
                                fieldName="cep"
                                isRequired={errorMsg.cep !== ''}
                                requireMsg={errorMsg.cep}
                                keyboardType="default"
                                label="CEP*"
                                placeholder=""
                                placeholderTextColor=""
                                secureTextEntry={false}
                                setValue={setValue}
                                value={user.address.cep}
                                maxLength={9}
                                mask={maskCep}
                            />
                            <InputField
                                fieldName="street"
                                isRequired={errorMsg.street !== ""}
                                requireMsg={errorMsg.street}
                                keyboardType="default"
                                label="Endereço*"
                                placeholder=""
                                placeholderTextColor=""
                                secureTextEntry={false}
                                setValue={setValue}
                                value={cepValues.street}
                                validationFunction={() => validationMap('street')}
                                editable={enableExtraFields}
                            />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                                <View style={{ flex: 1 }}>
                                    <InputField
                                        fieldName="number"
                                        isRequired={errorMsg.number !== ""}
                                        requireMsg={errorMsg.number}
                                        keyboardType="default"
                                        label="Número*"
                                        placeholder=""
                                        placeholderTextColor=""
                                        secureTextEntry={false}
                                        setValue={setValue}
                                        value={user.address.number}
                                        editable={true}
                                        validationFunction={() => validationMap('number')}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <InputField
                                        fieldName="complement"
                                        isRequired={false}
                                        keyboardType="default"
                                        label="Complemento"
                                        placeholder=""
                                        placeholderTextColor=""
                                        secureTextEntry={false}
                                        setValue={setValue}
                                        editable={true}
                                        value={user.address.complement}
                                        validationFunction={() => validationMap('complement')}
                                    />
                                </View>
                            </View>
                            <InputField
                                fieldName="neighborhood"
                                isRequired={errorMsg.neighborhood !== ""}
                                requireMsg={errorMsg.neighborhood}
                                keyboardType="default"
                                label="Bairro*"
                                placeholder=""
                                placeholderTextColor=""
                                secureTextEntry={false}
                                setValue={setValue}
                                value={cepValues.neighborhood}
                                validationFunction={() => validationMap('neighborhood')}
                                editable={enableExtraFields}
                            />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                                <View style={{ flex: 4 }}>
                                    <InputField
                                        fieldName="city"
                                        isRequired={errorMsg.city !== ""}
                                        requireMsg={errorMsg.city}
                                        keyboardType="default"
                                        label="Cidade*"
                                        placeholder=""
                                        placeholderTextColor=""
                                        secureTextEntry={false}
                                        setValue={setValue}
                                        value={cepValues.city}
                                        editable={false}
                                        validationFunction={() => validationMap('city')}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <InputField
                                        fieldName="state"
                                        isRequired={errorMsg.state !== ""}
                                        requireMsg={errorMsg.state}
                                        keyboardType="default"
                                        label="UF*"
                                        placeholder=""
                                        placeholderTextColor="#000000"
                                        secureTextEntry={false}
                                        setValue={setValue}
                                        value={cepValues.state}
                                        editable={false}
                                        validationFunction={() => validationMap('state')}
                                    />
                                </View>
                            </View>
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


export default UpdateAddress;
