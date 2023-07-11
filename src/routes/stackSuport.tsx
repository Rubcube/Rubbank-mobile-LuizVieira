import {
    NativeStackNavigationProp,
    createNativeStackNavigator,
} from '@react-navigation/native-stack';
import SuportOptions from '../screens/Support';
import Tickets from '../screens/Support/Tickets';
import Messages from '../screens/Support/Messages';
import NewTicket from '../screens/Support/newTicket';
const Drawer = createNativeStackNavigator();

type StackSuport = {
    SuportOptions: undefined;
    Tickets: undefined;
    Messages: {ticketId: string}
    NewTicket: undefined;
}

export type StackSuportTypes = NativeStackNavigationProp<StackSuport>;
export default function StackSuportComponent(): JSX.Element {
    return (
        <Drawer.Navigator screenOptions={{ headerShown: false }}>
            <Drawer.Screen name="SuportOptions" component={SuportOptions} options={{ animation: 'default' }} />
            <Drawer.Screen name="Tickets" component={Tickets} options={{ animation: 'default' }} />
            <Drawer.Screen name="Messages" component={Messages} options={{ animation: 'default' }} />
            <Drawer.Screen name="NewTicket" component={NewTicket} options={{ animation: 'default' }} />
        </Drawer.Navigator>
    );
}
