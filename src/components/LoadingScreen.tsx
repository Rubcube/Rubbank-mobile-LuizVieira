import { ActivityIndicator, Modal, View } from "react-native";

interface Props {
    visibility: boolean
}

export const LoadingScreen = ({visibility}: Props) => {
    return(
        <Modal visible={visibility} transparent={true}>
            <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,.5)', justifyContent: 'center'}}>
                <ActivityIndicator size="large" color="#1D1C3E" />
            </View>
        </Modal>
    );
}