import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "../../components/InputField";
import { FieldValues, useForm } from "react-hook-form";
import { useContext, useEffect, useState } from "react";
import DefaultButton from "../../components/DefaultButton";
import { maskCpf, maskData, maskPhone } from "../../utils/masks";
import { OnboadingContext } from "../../services/OnboardingContext";
import { useNavigation } from "@react-navigation/native";
import { StackOnboardingTypes } from "../../routes/stackOnboarding";
import { birthValidator, cpfValidator, emailValidator, nameValidator, phoneValidator } from "../../services/validateFields";
import { verifyExistsCpf, verifyExistsEmail } from "./services/onboardingApi.";
import ErrorModal from "../../components/ErrorModal";

const IndexOnboarding = () => {
    const { register, setValue, handleSubmit, watch } = useForm();
    const [onboarding, setOnboarding] = useContext(OnboadingContext);
    const navigation = useNavigation<StackOnboardingTypes>();

    const [isFormValid, setIsFormValid] = useState(false);

    const [errorMsg, setErrorMsg] = useState({
        fullName: '',
        cpf: '',
        email: '',
        phone: '',
        birth: ''
    });

    useEffect(() => {
        register('fullName')
        register('email')
        register('phone')
        register('cpf')
        register('birth')
    }, [register]);

    useEffect(() => {
        if (watch('fullName') && watch('email') && watch('phone') && watch('cpf') &&
            errorMsg.fullName === '' &&
            errorMsg.cpf === '' &&
            errorMsg.email === '' &&
            errorMsg.phone === '' &&
            errorMsg.birth === '') {
            setIsFormValid(true);
        } else {
            setIsFormValid(false)
        }
    }, [errorMsg])

    const validationMap = (field: string) => {
        switch (field) {
            case 'fullName':
                setErrorMsg({ ...errorMsg, fullName: nameValidator(watch('fullName')) });
                break;
            case 'email':
                setErrorMsg({ ...errorMsg, email: emailValidator(watch('email')) });
                break;
            case 'phone':
                setErrorMsg({ ...errorMsg, phone: phoneValidator(watch('phone')) });
                break;
            case 'cpf':
                setErrorMsg({ ...errorMsg, cpf: cpfValidator(watch('cpf')) });
                break;
            case 'birth':
                setErrorMsg({ ...errorMsg, birth: birthValidator(watch('birth')) });
                break;
            default:
                break;
        }
    }

    const onSubmit = async (data: FieldValues) => {
        const existsCpf = await verifyExistsCpf(data.cpf);
        const existsEmail = await verifyExistsEmail(data.email);

        if (!existsCpf && !existsEmail) {

            setOnboarding({
                ...onboarding,
                progress: 0.4,
                fullName: data.fullName,
                phone: data.phone,
                email: data.email,
                birth: data.birth,
                userAuth: {
                    ...onboarding.userAuth,
                    cpf: data.cpf
                }
            });
            navigation.navigate('CepScreen');
        } else {
            setErrVisibility(true);
        }
    }

    const [errVisibility, setErrVisibility] = useState(false);
    return (
        <SafeAreaView style={{ backgroundColor: '#FFFFFF', flex: 1 }}>
            <ErrorModal
                visibility={errVisibility}
                errorMsg={"Cpf ou email ja cadastrado, por favor faça seu login ou entre em contato com nosso suporte"}
                setVisibility={() => {setErrVisibility(!errVisibility)}} />
            <ScrollView>
                <View style={{ padding: 36, paddingTop: 20, gap: 20 }}>
                    <Text style={{ fontSize: 24, fontWeight: '400', textAlign: 'center' }}>Preencha abaixo com seus dados pessoais.</Text>
                    <InputField
                        fieldName="fullName"
                        isRequired={errorMsg.fullName !== ''}
                        requireMsg={errorMsg.fullName}
                        keyboardType="default"
                        label="Nome Completo*"
                        placeholder="Insira seu nome completo"
                        placeholderTextColor={'#AAABAB'}
                        secureTextEntry={false}
                        setValue={setValue}
                        validationFunction={() => validationMap('fullName')}
                    />
                    <InputField
                        fieldName="email"
                        isRequired={errorMsg.email !== ''}
                        requireMsg={errorMsg.email}
                        keyboardType="default"
                        label="E-mail*"
                        placeholder="Insira seu email"
                        placeholderTextColor={'#AAABAB'}
                        secureTextEntry={false}
                        setValue={setValue}
                        validationFunction={() => validationMap('email')}
                    />
                    <InputField
                        fieldName="phone"
                        isRequired={errorMsg.phone !== ''}
                        requireMsg={errorMsg.phone}
                        keyboardType="default"
                        label="Telefone*"
                        placeholder="Insira seu telefone"
                        placeholderTextColor={'#AAABAB'}
                        secureTextEntry={false}
                        setValue={setValue}
                        mask={maskPhone}
                        maxLength={15}
                        validationFunction={() => validationMap('phone')}
                    />
                    <InputField
                        fieldName="cpf"
                        isRequired={errorMsg.cpf !== ''}
                        requireMsg={errorMsg.cpf}
                        keyboardType="default"
                        label="CPF*"
                        placeholder="Insira seu cpf"
                        placeholderTextColor={'#AAABAB'}
                        secureTextEntry={false}
                        setValue={setValue}
                        mask={maskCpf}
                        maxLength={14}
                        validationFunction={() => validationMap('cpf')}
                    />
                    <InputField
                        fieldName="birth"
                        isRequired={errorMsg.birth !== ''}
                        requireMsg={errorMsg.birth}
                        keyboardType="default"
                        label="Data de nascimento"
                        placeholder="Insira sua data de nascimento"
                        placeholderTextColor={'#AAABAB'}
                        secureTextEntry={false}
                        setValue={setValue}
                        mask={maskData}
                        maxLength={10}
                        validationFunction={() => validationMap('birth')}
                    />
                    <TouchableOpacity style={{ alignSelf: 'center', marginTop: 20 }} disabled={!isFormValid} onPress={handleSubmit(onSubmit)}>
                        <DefaultButton color={isFormValid ? "#1D1C3E" : "#CCCCCC"} text="CONFIRMAR" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default IndexOnboarding;