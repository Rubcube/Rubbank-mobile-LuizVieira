import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { styled } from "styled-components";
import DefaultButton from "../../components/DefaultButton";

const ErrorModalContainer = styled(View)`
    flex: 1;
    background-color: rgba(0,0,0,.5);
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 36px;
    gap: 12px;
`
const ModalContent = styled(View)`
    background-color: #FFFFFF;
    align-self: stretch;
    border-radius: 0px 0px 6px 6px;
    align-items: center;
    justify-content: center;
    padding: 33px;
    gap: 20px;
`;

interface Props {
    visibility: boolean
    setVisibility: () => void
    count: number
    isBlocked: boolean
}

const WrongPassModal = ({ visibility, setVisibility, count, isBlocked }: Props) => {
    return (
        <Modal visible={visibility} transparent={true} onRequestClose={setVisibility}>
            <ErrorModalContainer>
                <ModalContent>
                    {!isBlocked ?
                        <>
                            <View style={{ alignSelf: 'center' }}>
                                <Text style={{ fontSize: 24, fontFamily: 'Roboto', fontWeight: '700', textAlign: "center" }}>
                                    Senha inválida
                                </Text>
                                <Text style={{ fontSize: 14, fontFamily: 'Roboto', textAlign: 'center', maxWidth: 200 }}>
                                    Você tem mais <Text style={{ fontWeight: '700' }}>{3 - count} tentativas</Text>. Verifique se digitou sua senha corretamente.
                                </Text>
                            </View>
                            <TouchableOpacity style={{ alignSelf: 'center' }}>
                                <DefaultButton color="#1D1C3E" text="FALAR COM SUPORTE" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={setVisibility}>
                                <Text style={{ fontSize: 16, color: '#383838', fontWeight: '500' }}>TENTAR NOVAMENTE</Text>
                            </TouchableOpacity>
                        </>
                        :
                        <>
                            <View style={{ alignSelf: 'center' }}>
                                <Text style={{ fontSize: 24, fontFamily: 'Roboto', fontWeight: '700', textAlign: "center" }}>
                                    Conta bloqueada
                                </Text>
                                <Text style={{ fontSize: 14, fontFamily: 'Roboto', textAlign: 'center', maxWidth: 200 }}>
                                    Por motivos de segurança a sua conta foi bloqueada. Por favor, entre em contato com o nosso suporte para realizar o desbloqueio.
                                </Text>
                            </View>
                            <TouchableOpacity style={{ alignSelf: 'center' }}>
                                <DefaultButton color="#1D1C3E" text="FALAR COM SUPORTE" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => { }}>
                                <Text style={{ fontSize: 16, color: '#383838', fontWeight: '500' }}>VOLTAR PARA O INÍCIO</Text>
                            </TouchableOpacity>
                        </>
                    }
                </ModalContent>
            </ErrorModalContainer>
        </Modal>
    );
}

const styles = StyleSheet.create({
    button: {
        alignSelf: 'stretch',
        alignItems: 'center',
        paddingVertical: 14,
        borderColor: '#383838',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 30,
        marginTop: 0
    }
})

export default WrongPassModal;