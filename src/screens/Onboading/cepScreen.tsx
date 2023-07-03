import { useContext, useEffect, useState } from "react";
import { OnboadingContext } from "../../services/OnboardingContext";
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import InputField from "../../components/InputField";
import { useForm } from "react-hook-form";
import Feather from 'react-native-vector-icons/Feather';
import DefaultButton from "../../components/DefaultButton";
import getAddress from "../../services/viaCepApi";
import { responseViaCepDTO } from "../../types/responseDTO";
import { maskCep } from "../../utils/masks";
import { LoadingScreen } from "../../components/LoadingScreen";
import { useNavigation } from "@react-navigation/native";
import { StackOnboardingTypes } from "../../routes/stackOnboarding";

const CepScreen = () => {
    const [onboading, setOnboading] = useContext(OnboadingContext);
    const { register, setValue, handleSubmit } = useForm();
    const [isInvalidCep, setIsInvalidCep] = useState(false);
    const [loadingVisibility, setLoandingVisibility] = useState(false);
    const navigation = useNavigation<StackOnboardingTypes>();


    useEffect(() => {
        register('cep')
    }, [register]);

    const onSubmit = async (data: any) => {
        if(!data.cep){
            setIsInvalidCep(true);
            return;
        }
        data.cep = data.cep.replace('-','');    
        setLoandingVisibility(true);
        const response: responseViaCepDTO | undefined = await getAddress(data.cep);
        setLoandingVisibility(false);
        if(response?.erro)setIsInvalidCep(true);
        else{
            setIsInvalidCep(false);
            setOnboading({
                ...onboading,
                progress: 0.6,
                address: {
                    cep: response?.cep? response.cep: "",
                    city: response?.localidade? response.localidade: "",
                    complement: response?.complemento? response.complemento: "",
                    neighborhood: response?.bairro? response.bairro: "",
                    number: "",
                    state: response?.uf? response.uf: "",
                    street: response?.logradouro? response.logradouro: "",
                }
            });
            navigation.navigate('AddressScreen');
        }   
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <LoadingScreen visibility={loadingVisibility} />
            <ScrollView>
            <View style={{ padding: 36, flex: 1, marginTop: 30 }}>
                <Text style={{ fontSize: 24, fontWeight: '400', textAlign: 'center', padding: 20 }}>
                    Agora informe o seu endereço. Qual é o seu <Text style={{ fontWeight: '700' }}>CEP</Text>?
                </Text>
                <InputField
                    fieldName="cep"
                    isRequired={isInvalidCep}
                    keyboardType="numeric"
                    label=""
                    placeholder="Insira seu CEP aqui"
                    placeholderTextColor={'#AAABAB'}
                    secureTextEntry={false}
                    setValue={setValue}
                    alignment="center"
                    requireMsg="Insira um CEP válido"
                    maxLength={9}
                    mask={maskCep}
                />
                <View style={{ flexDirection: "row", gap: 6, marginTop: 50 }}>
                    <Feather name="info" size={12} style={{ marginTop: 4 }} />
                    <Text style={{ color: '#AAABAB' }}>
                        Utilizamos o seu endereço para o envio de correspondências, como cartão
                        físico quando solicitado.
                    </Text>

                </View>
                <TouchableOpacity style={{alignSelf: 'center', marginTop: 60}} onPress={handleSubmit(onSubmit)}>
                    <DefaultButton
                        color="#1D1C3E"
                        text="CONFIRMAR"
                    />
                </TouchableOpacity>
            </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default CepScreen;