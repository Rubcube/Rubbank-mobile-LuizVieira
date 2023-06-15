import { Modal, Text, TouchableOpacity, View } from "react-native";
import { styled } from "styled-components";

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

const ErrorIcon = styled(View)`
    background-color: #FFC700;
    width: 52px;
    height: 52px;
    border-radius: 26px;
    align-items: center;
    justify-content: center;
`;

const CloseModalIcon = styled(TouchableOpacity)`
    align-self: flex-end;
`;

interface Props {
    visibility: boolean
    errorMsg: string
    setVisibility: () => void
}

const ErrorModal = ({ visibility, errorMsg, setVisibility }: Props) => {
    return (
        <Modal visible={visibility} transparent={true} onRequestClose={setVisibility}>
            <ErrorModalContainer>
                <CloseModalIcon onPress={setVisibility}>
                    <Text style={{ fontSize: 14, color: '#FFFFFF', fontWeight: '600' }}>
                        X Fechar
                    </Text>
                </CloseModalIcon>
                <ModalContent>
                    <ErrorIcon><Text style={{ color: '#FFFFFF', fontWeight: '500', fontSize: 35 }}>!</Text></ErrorIcon>
                    <View>
                        <Text style={{ fontSize: 20, fontFamily: 'Roboto', fontWeight: '500', textAlign: "center" }}>
                            Atenção
                        </Text>
                        <Text style={{ fontSize: 14, fontFamily: 'Roboto', textAlign: 'center' }}>
                            {errorMsg}
                        </Text>
                    </View>
                </ModalContent>
            </ErrorModalContainer>
        </Modal>
    );
}

export default ErrorModal;