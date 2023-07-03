import { useContext, useEffect, useState } from "react";
import { OnboadingContext } from "../../services/OnboardingContext";
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import InputField from "../../components/InputField";
import DefaultButton from "../../components/DefaultButton";
import { FieldValues, useForm } from "react-hook-form";
import { StackOnboardingTypes } from "../../routes/stackOnboarding";
import { useNavigation } from "@react-navigation/native";
import { cityValidator, neighborhoodValidator, numberValidator, stateValidator, streetValidator } from "../../services/validateFields";

const AddressScreen = () => {
    const navigation = useNavigation<StackOnboardingTypes>();
    const [onboarding, setOnboarding] = useContext(OnboadingContext);
    const { register, setValue, handleSubmit, watch } = useForm();

    const [isFormValid, setIsFormValid] = useState(false);

    const [errorMsg, setErrorMsg] = useState({
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: ''
    })

    useEffect(() => {
        setValue('cep', onboarding.address.cep);
        setValue('street', onboarding.address.street);
        setValue('neighborhood', onboarding.address.neighborhood);
        setValue('city', onboarding.address.city);
        setValue('state', onboarding.address.state);

        register('cep')
        register('street')
        register('number')
        register('complement')
        register('neighborhood')
        register('city')
        register('state')
    }, [register]);

    useEffect(() => {
        if (watch('street') && watch('number') && watch('neighborhood') && watch('city') && watch('state') &&
            errorMsg.street === '' &&
            errorMsg.number === '' &&
            errorMsg.neighborhood === '' &&
            errorMsg.city === '' &&
            errorMsg.state === '') {
            setIsFormValid(true);
        } else {
            setIsFormValid(false)
        }
    }, [errorMsg])

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
            default:
                break;
        }
    }

    const onSubmit = (data: FieldValues) => {

        setOnboarding({
            ...onboarding,
            address: {
                cep: data.cep,
                city: data.city,
                complement: data.complement ? data.complement : '',
                neighborhood: data.neighborhood,
                number: data.number,
                state: data.state,
                street: data.street
            },
            progress: 0.8
        });

        navigation.navigate('AppPassScreen')

    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <ScrollView>
                <View style={{ padding: 36, paddingTop: 20, gap: 20 }}>
                    <Text style={{ fontSize: 24, fontWeight: '400', textAlign: 'center' }}>
                        Complete os campos abaixo com seu <Text style={{ fontWeight: '700' }}>endereço</Text>.
                    </Text>
                    <InputField
                        fieldName="cep"
                        isRequired={false}
                        keyboardType="default"
                        label="CEP*"
                        placeholder=""
                        placeholderTextColor=""
                        secureTextEntry={false}
                        setValue={setValue}
                        value={onboarding.address.cep}
                        editable={onboarding.address.cep === ""}
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
                        value={onboarding.address.street}
                        validationFunction={() => validationMap('street')}
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
                        value={onboarding.address.neighborhood}
                        validationFunction={() => validationMap('neighborhood')}
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
                                value={onboarding.address.city}
                                editable={onboarding.address.city === ""}
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
                                value={onboarding.address.state}
                                editable={onboarding.address.state === ""}
                                validationFunction={() => validationMap('state')}
                            />
                        </View>
                    </View>
                    <TouchableOpacity style={{ alignSelf: 'center', marginTop: 20 }} onPress={handleSubmit(onSubmit)} disabled={!isFormValid}>
                        <DefaultButton color={isFormValid? "#1D1C3E": "#CCCCCC"} text="CONFIRMAR" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default AddressScreen;