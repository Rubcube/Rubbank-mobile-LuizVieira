import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import { styled } from "styled-components";
import Ionicons from 'react-native-vector-icons/Ionicons';

const ModalContainer = styled(View)`
    flex: 1;
    flex-direction: column;
    background-color: #FFFFFF;
    align-items: center;
    padding: 36px;
`;

const SuccessButton = styled(TouchableOpacity)`
    background-color: #00204A;
    height: 50px;
    border-radius: 25px;
    align-self: stretch;
    align-items: center;
    justify-content: center;
`;

const RuleItem = styled(View)`
    flex-direction: row;
    align-items: center;
    gap: 10px;
`;

const RuleText = styled(Text)`
    font-size: 14px;
    flex: 1;
    flex-wrap: wrap;
    color: #383838;
`;

interface Props {
    visibility: boolean
    btnText: string
    actionButton: () => void
}

const InfoModal = (props: Props) => {
    return (
        <Modal visible={props.visibility} transparent={false} onRequestClose={props.actionButton}>
            <ModalContainer>
                <View style={{ flex: 1, gap: 40, marginTop: 40 }}>
                    <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '700' }}>Criar senha</Text>
                    <Text style={{ fontSize: 15, color: '#383838' }}>Siga as instruções abaixo para criar uma senha segura:</Text>
                    <RuleItem>
                        <Ionicons name="checkmark-sharp" color={"#00204A"} size={24} />
                        <RuleText>A senha deve conter no mínimo 8 caracteres e não deve conter espaços</RuleText>
                    </RuleItem>
                    <RuleItem>
                        <Ionicons name="checkmark-sharp" color={"#00204A"} size={24} />
                        <RuleText>Pelo menos uma letra maiúscula e uma letra minúscula</RuleText>
                    </RuleItem>
                    <RuleItem>
                        <Ionicons name="checkmark-sharp" color={"#00204A"} size={24} />
                        <RuleText>Pelo menos um número e um caractere especial, como por exemplo (!@#$%^&*)</RuleText>
                    </RuleItem>

                </View>
                <SuccessButton onPress={props.actionButton}><Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '500' }}>{props.btnText}</Text></SuccessButton>
            </ModalContainer>
        </Modal>
    );
}

export default InfoModal;