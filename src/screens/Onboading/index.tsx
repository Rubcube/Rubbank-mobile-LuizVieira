import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "../../components/InputField";
import { useForm } from "react-hook-form";
import { useContext, useEffect, useState } from "react";
import DefaultButton from "../../components/DefaultButton";
import { maskCpf, maskData, maskPhone } from "../../utils/masks";
import { regex } from "../../utils/consts";
import { validateCpf } from "../../services/validateFields";
import { OnboadingContext } from "../../services/OnboardingContext";
import { useNavigation } from "@react-navigation/native";
import { StackOnboardingTypes } from "../../routes/stackOnboarding";

const IndexOnboarding = () => {
    const { register, setValue, handleSubmit } = useForm();
    const [onboarding, setOnboarding] = useContext(OnboadingContext);
    const navigation = useNavigation<StackOnboardingTypes>();
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        register('fullName')
        register('email')
        register('phone')
        register('cpf')
        register('birth')
    }, [register]);

    const [fieldIsInvalid, setFieldIsInvalid] = useState({
        name: {
            status: false,
            msg: ''
        },
        email: {
            status: false,
            msg: ''
        },
        phone: {
            status: false,
            msg: ''
        },
        cpf: {
            status: false,
            msg: ''
        },
        birth: {
            status: false,
            msg: ''
        }
    });

    const nameValidator = (data: any) => {
        if (!data.fullName) setFieldIsInvalid({ ...fieldIsInvalid, name: { status: true, msg: 'Campo obrigatório' } });
        else if (!regex.fullName.test(data.fullName)) setFieldIsInvalid({ ...fieldIsInvalid, name: { status: true, msg: 'Digite seu nome completo' } });
        else setFieldIsInvalid({ ...fieldIsInvalid, name: { status: false, msg: '' } });
    }

    const emailValidator = (data: any) => {
        if (!data.email) setFieldIsInvalid({ ...fieldIsInvalid, email: { status: true, msg: 'Campo obrigatório' } });
        else if (!regex.email.test(data.email)) setFieldIsInvalid({ ...fieldIsInvalid, email: { status: true, msg: 'Digite um email válido' } });
        else setFieldIsInvalid({ ...fieldIsInvalid, email: { status: false, msg: '' } });
    }

    const phoneValidator = (data: any) => {
        if (!data.phone) setFieldIsInvalid({ ...fieldIsInvalid, phone: { status: true, msg: 'Campo obrigatório' } });
        else if (!regex.phone.test(data.phone)) setFieldIsInvalid({ ...fieldIsInvalid, phone: { status: true, msg: 'Digite um telefone válido' } });
        else setFieldIsInvalid({ ...fieldIsInvalid, phone: { status: false, msg: '' } });
    }

    const cpfValidator = (data: any) => {
        if (!data.cpf) setFieldIsInvalid({ ...fieldIsInvalid, cpf: { status: true, msg: 'Campo obrigatório' } });
        else if (!validateCpf(data.cpf)) setFieldIsInvalid({ ...fieldIsInvalid, cpf: { status: true, msg: 'Digite um cpf válido' } });
        else setFieldIsInvalid({ ...fieldIsInvalid, cpf: { status: false, msg: '' } });
    }

    const isAllValid = () => {
        return (
            !fieldIsInvalid.name.status &&
            !fieldIsInvalid.email.status &&
            !fieldIsInvalid.phone.status &&
            !fieldIsInvalid.cpf.status &&
            !fieldIsInvalid.birth.status
        );
    }

    const onSubmit = (data: any) => {

        setFieldIsInvalid({
            name: {
                status: !data.fullName,
                msg: 'Campo obrigatório'
            },
            email: {
                status: !data.email,
                msg: 'Campo obrigatório'
            },
            cpf: {
                status: !data.cpf,
                msg: 'Campo obrigatório'
            },
            phone: {
                status: !data.phone,
                msg: 'Campo obrigatório'
            },
            birth: {
                status: false,
                msg: ''
            }
        })

        setIsFormValid(isAllValid());
        if (isFormValid) {
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
        }
    }


    return (
        <SafeAreaView style={{ backgroundColor: '#FFFFFF', flex: 1 }}>
            <ScrollView>
                <View style={{ padding: 36, paddingTop: 20, gap: 20 }}>
                    <Text style={{ fontSize: 24, fontWeight: '400', textAlign: 'center' }}>Preencha abaixo com seus dados pessoais.</Text>
                    <InputField
                        fieldName="fullName"
                        isRequired={fieldIsInvalid.name.status}
                        requireMsg={fieldIsInvalid.name.msg}
                        keyboardType="default"
                        label="Nome Completo*"
                        placeholder="Insira seu nome completo"
                        placeholderTextColor={'#AAABAB'}
                        secureTextEntry={false}
                        setValue={setValue}
                        validationFunction={handleSubmit(nameValidator)}
                    />
                    <InputField
                        fieldName="email"
                        isRequired={fieldIsInvalid.email.status}
                        requireMsg={fieldIsInvalid.email.msg}
                        keyboardType="default"
                        label="E-mail*"
                        placeholder="Insira seu email"
                        placeholderTextColor={'#AAABAB'}
                        secureTextEntry={false}
                        setValue={setValue}
                        validationFunction={handleSubmit(emailValidator)}
                    />
                    <InputField
                        fieldName="phone"
                        isRequired={fieldIsInvalid.phone.status}
                        requireMsg={fieldIsInvalid.phone.msg}
                        keyboardType="default"
                        label="Telefone*"
                        placeholder="Insira seu telefone"
                        placeholderTextColor={'#AAABAB'}
                        secureTextEntry={false}
                        setValue={setValue}
                        mask={maskPhone}
                        maxLength={15}
                        validationFunction={handleSubmit(phoneValidator)}
                    />
                    <InputField
                        fieldName="cpf"
                        isRequired={fieldIsInvalid.cpf.status}
                        requireMsg={fieldIsInvalid.cpf.msg}
                        keyboardType="default"
                        label="CPF*"
                        placeholder="Insira seu cpf"
                        placeholderTextColor={'#AAABAB'}
                        secureTextEntry={false}
                        setValue={setValue}
                        mask={maskCpf}
                        maxLength={14}
                        validationFunction={handleSubmit(cpfValidator)}
                    />
                    <InputField
                        fieldName="birth"
                        isRequired={fieldIsInvalid.birth.status}
                        requireMsg={fieldIsInvalid.birth.msg}
                        keyboardType="default"
                        label="Data de nascimento"
                        placeholder="Insira sua data de nascimento"
                        placeholderTextColor={'#AAABAB'}
                        secureTextEntry={false}
                        setValue={setValue}
                        mask={maskData}
                        maxLength={10}
                    />
                    <TouchableOpacity style={{ alignSelf: 'center', marginTop: 20 }} onPress={handleSubmit(onSubmit)}>
                        <DefaultButton color={"#1D1C3E"} text="CONFIRMAR" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default IndexOnboarding;