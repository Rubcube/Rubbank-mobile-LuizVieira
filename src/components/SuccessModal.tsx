import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import { styled } from "styled-components";
import check from '../assets/check-mark.png'

const ModalContainer = styled(View)`
    flex: 1;
    flex-direction: column;
    background-color: #FFFFFF;
    justify-content: space-between;
    align-items: center;
    gap: 30px;
    padding: 36px;
`;

const SuccessIcon = styled(Image)`
    width: 80px;
    height: 80px;
`;

const SuccessTitle = styled(Text)`
    font-family: 'Roboto';
    font-weight: 700;
    font-size: 20px;
    color: #383838;
    text-align: center;
`;

const SuccessMsg = styled(Text)`
    font-family: 'Roboto';
    font-weight: 400;
    font-size: 16px;
    color: #383838;
    text-align: center;
`;

const SuccessButton = styled(TouchableOpacity)`
    background-color: #00204A;
    height: 50px;
    border-radius: 25px;
    align-self: stretch;
    align-items: center;
    justify-content: center;


`;

interface Props {
    visibility: boolean
    successTitle: string
    successMsg?: string
    successMsg2?: string
    btnText: string
    actionButton: () => void
}

const SuccessModal = (props: Props) => {
    return (
        <Modal visible={props.visibility} transparent={false}>
            <ModalContainer>
                <View></View>
                <View style={{alignItems: 'center', gap: 30}}>
                    <SuccessIcon source={check} resizeMode="contain" />
                    <SuccessTitle>{props.successTitle}</SuccessTitle>
                    {
                        props.successMsg && <SuccessMsg>{props.successMsg}</SuccessMsg>
                    }
                    {
                        props.successMsg2 && <SuccessMsg>{props.successMsg2}</SuccessMsg>
                    }
                </View>
                <SuccessButton onPress={props.actionButton}><Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '500' }}>{props.btnText}</Text></SuccessButton>
            </ModalContainer>
        </Modal>
    );
}

export default SuccessModal;