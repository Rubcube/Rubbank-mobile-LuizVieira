import {
    NativeStackNavigationProp,
    createNativeStackNavigator,
} from '@react-navigation/native-stack';
import InitialStepTransfer from '../screens/Transfer';
import TransferResume from '../screens/Transfer/TransferResume';
import TransferPassword from '../screens/Transfer/TransferPassword';
import { AccountInfoDTO } from '../types/AccountDTO';
const Drawer = createNativeStackNavigator();

type StackTransfer = {
    TransferIndex: undefined;
    TransferResume: {account: AccountInfoDTO};
    TransferPassword: undefined;
}

export type StackTransferTypes = NativeStackNavigationProp<StackTransfer>;
export default function StackTransferComponent(): JSX.Element {
    return (
        <Drawer.Navigator screenOptions={{ headerShown: false }}>
            <Drawer.Screen name="TransferIndex" component={InitialStepTransfer} options={{ animation: 'default' }} />
            <Drawer.Screen name="TransferResume" component={TransferResume} options={{ animation: 'default' }} />
            <Drawer.Screen name="TransferPassword" component={TransferPassword} options={{ animation: 'default' }} />
        </Drawer.Navigator>
    );
}
