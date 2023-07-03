import { useContext, useEffect, useState } from "react";
import { OnboadingContext } from "../../services/OnboardingContext";
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import InputField from "../../components/InputField";
import DefaultButton from "../../components/DefaultButton";
import { FieldValues, useForm } from "react-hook-form";
import { StackOnboardingTypes } from "../../routes/stackOnboarding";
import { useNavigation } from "@react-navigation/native";
import { passwordValidator, transactionPasswordValidator } from "../../services/validateFields";
import Feather from 'react-native-vector-icons/Feather';
import InfoModal from "../../components/infoModal";
import { maskTransactionPassword } from "../../utils/masks";
import postOnboarding from "./services/onboardingApi.";
import ErrorModal from "../../components/ErrorModal";
import { LoadingScreen } from "../../components/LoadingScreen";
import { responseOnboardingDTO } from "../../types/responseDTO";
import SuccessModal from "../../components/SuccessModal";
import { StackTypes } from "../../routes/stackNavigation";

const TransactionPassScreen = () => {
    const navigation = useNavigation<StackTypes>();
    const [onboarding, setOnboarding] = useContext(OnboadingContext);
    const { register, setValue, handleSubmit, watch } = useForm();

    const [isFormValid, setIsFormValid] = useState(false)

    const [errorMsg, setErrorMsg] = useState({
        password: '',
        confirmPassword: ''
    })

    useEffect(() => {
        register('password')
        register('confirmPassword')
    }, [register])

    useEffect(() => {
        if (watch('password') && watch('confirmPassword') && errorMsg.password === '' && errorMsg.confirmPassword === '') {
            setIsFormValid(true)
        } else {
            setIsFormValid(false)
        }
    }, [errorMsg])

    const validationMap = (field: string) => {
        switch (field) {
            case 'password':
                setErrorMsg({ ...errorMsg, password: transactionPasswordValidator(watch('password')) });
                break;
            case 'confirmPassword':
                setErrorMsg({ ...errorMsg, confirmPassword: watch('password') === watch('confirmPassword') ? '' : 'As senhas dever ser iguais' })
                break;
            default:
                break;
        }
    }

    const onSubmit = async (data: FieldValues) => {
        setOnboarding({
            ...onboarding,
            account: {
                transactionPassword: data.password
            }
        });
        setLoadingVisibility(true);
        const res: responseOnboardingDTO = await postOnboarding(onboarding, data.password);
        setLoadingVisibility(false);

        if(res.error){
            setModalError(res.error[0].message)
        }else{
            setSuccessVisibility(true);
        }
    }

    const [infoVisibility, setInfoVisibility] = useState(false);
    const [loadingVisibility, setLoadingVisibility] = useState(false);
    const [successVisibility, setSuccessVisibility] = useState(false);
    const [modalError, setModalError] = useState('');
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'space-between', paddingBottom: 40 }}>
            <InfoModal actionButton={() => setInfoVisibility(!infoVisibility)} btnText="ENTENDI" visibility={infoVisibility} />
            <ErrorModal
                visibility={modalError !== ''}
                errorMsg={modalError}
                setVisibility={() => {setModalError('')}} />
            <LoadingScreen visibility={loadingVisibility} />
            <SuccessModal 
                btnText="FAZER LOGIN"
                successTitle="Sua conta digital RubBank foi criada com sucesso!"
                successMsg="Vamos avaliar seu cadastro e validar sua conta"
                successMsg2="Acesse agora com seu CPF e senha cadastrados"
                visibility={successVisibility}
                actionButton={() => {navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  });}}
            />
            <ScrollView >
                <View style={{ padding: 36, paddingTop: 20, gap: 20 }}>
                    <Text style={{ fontSize: 24, fontWeight: '400', textAlign: 'center' }}>
                        Digite qual será sua senha para efetuar transações
                    </Text>
                    <TouchableOpacity style={{ alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 5 }} >
                        <Feather name="info" size={12} color={'#00204A'} />
                        <Text style={{ color: "#00204A", fontSize: 12, fontWeight: '700' }}>Senha numérica de 4 digitos</Text>
                    </TouchableOpacity>
                    <View style={{ marginTop: 20, gap: 40 }}>
                        <InputField
                            fieldName="password"
                            isRequired={errorMsg.password !== ''}
                            requireMsg={errorMsg.password}
                            keyboardType="numeric"
                            label="Digite sua senha"
                            placeholder=""
                            placeholderTextColor=""
                            secureTextEntry={true}
                            setValue={setValue}
                            validationFunction={() => validationMap('password')}
                            mask={maskTransactionPassword}
                            maxLength={4}
                        />
                        <InputField
                            fieldName="confirmPassword"
                            isRequired={errorMsg.confirmPassword !== ''}
                            requireMsg={errorMsg.confirmPassword}
                            keyboardType="numeric"
                            label="Confirme sua senha"
                            placeholder=""
                            placeholderTextColor=""
                            secureTextEntry={true}
                            setValue={setValue}
                            validationFunction={() => validationMap('confirmPassword')}
                            maxLength={4}
                            mask={maskTransactionPassword}
                        />
                    </View>
                </View>


            </ScrollView>
            <View>
                <TouchableOpacity style={{ alignSelf: 'center', marginTop: 20 }} disabled={!isFormValid} onPress={handleSubmit(onSubmit)}>
                    <DefaultButton color={isFormValid ? "#1D1C3E" : "#CCCCCC"} text="CONFIRMAR" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

export default TransactionPassScreen;