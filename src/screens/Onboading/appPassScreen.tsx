import { useContext, useEffect, useState } from "react";
import { OnboadingContext } from "../../services/OnboardingContext";
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import InputField from "../../components/InputField";
import DefaultButton from "../../components/DefaultButton";
import { FieldValues, useForm } from "react-hook-form";
import { StackOnboardingTypes } from "../../routes/stackOnboarding";
import { useNavigation } from "@react-navigation/native";
import { passwordValidator } from "../../services/validateFields";
import Feather from 'react-native-vector-icons/Feather';
import InfoModal from "../../components/infoModal";

const AppPassScreen = () => {
    const navigation = useNavigation<StackOnboardingTypes>();
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
                setErrorMsg({ ...errorMsg, password: passwordValidator(watch('password')) });
                break;
            case 'confirmPassword':
                setErrorMsg({ ...errorMsg, confirmPassword: watch('password') === watch('confirmPassword') ? '' : 'As senhas dever ser iguais' })
                break;
            default:
                break;
        }
    }

    const onSubmit = (data: FieldValues) => {
        setOnboarding({
            ...onboarding,
            userAuth: {
                ...onboarding.userAuth,
                password: data.password
            },
            progress: 0.95
        });
        navigation.navigate('TransactionPassScreen');
    }

    const [infoVisibility, setInfoVisibility] = useState(false);
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'space-between', paddingBottom: 40 }}>
            <InfoModal actionButton={() => setInfoVisibility(!infoVisibility)} btnText="ENTENDI" visibility={infoVisibility}/>
            <ScrollView >
                <View style={{ padding: 36, paddingTop: 20, gap: 20 }}>
                    <Text style={{ fontSize: 24, fontWeight: '400', textAlign: 'center' }}>
                        Digite qual será sua senha para entrar no aplicativo
                    </Text>
                    <TouchableOpacity style={{ alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 5 }} onPress={() => {setInfoVisibility(!infoVisibility)}}>
                        <Feather name="info" size={12} color={'#00204A'} />
                        <Text style={{ color: "#00204A", fontSize: 12, fontWeight: '700' }}>Como criar uma senha segura</Text>
                    </TouchableOpacity>
                    <View style={{marginTop: 20, gap: 40}}>
                        <InputField
                            fieldName="password"
                            isRequired={errorMsg.password !== ''}
                            requireMsg={errorMsg.password}
                            keyboardType="default"
                            label="Digite sua senha"
                            placeholder=""
                            placeholderTextColor=""
                            secureTextEntry={true}
                            setValue={setValue}
                            validationFunction={() => validationMap('password')}
                        />
                        <InputField
                            fieldName="confirmPassword"
                            isRequired={errorMsg.confirmPassword !== ''}
                            requireMsg={errorMsg.confirmPassword}
                            keyboardType="default"
                            label="Confirme sua senha"
                            placeholder=""
                            placeholderTextColor=""
                            secureTextEntry={true}
                            setValue={setValue}
                            validationFunction={() => validationMap('confirmPassword')}
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

export default AppPassScreen;