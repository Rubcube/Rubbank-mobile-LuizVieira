import {
    NativeStackNavigationProp,
    createNativeStackNavigator,
} from '@react-navigation/native-stack';
import PerfilIndex from '../screens/Perfil';
import { useState } from 'react';
import { UserContext, initialUserState } from '../services/UserContext';
import DataUser from '../screens/Perfil/userData';
import UpdateAddress from '../screens/Perfil/updateAddress';
import HomeScreen from '../screens/HomeScreen/index.';
import UpdateAppPass from '../screens/Perfil/updateAppPass';
import UpdateTransactionPass from '../screens/Perfil/updateTransactionPass';
const Drawer = createNativeStackNavigator();

type StackPerfil = {
    PerfilIndex: undefined;
    DataUser: undefined;
    UpdateAddress: undefined;
    UpdateAppPass: undefined;
    UpdateTransactionPass: undefined;
}

export type StackPefilTypes = NativeStackNavigationProp<StackPerfil>;
export default function StackPerfilComponent(): JSX.Element {
    const [user, setUser] = useState(initialUserState);
    return (
        <UserContext.Provider value={[user, setUser]}>
            <Drawer.Navigator screenOptions={{ headerShown: false }}>
                <Drawer.Screen name="PerfilIndex" component={PerfilIndex} options={{ animation: 'default' }} />
                <Drawer.Screen name="DataUser" component={DataUser} options={{ animation: 'default' }} />
                <Drawer.Screen name="UpdateAddress" component={UpdateAddress} options={{ animation: 'default' }} />
                <Drawer.Screen name="UpdateAppPass" component={UpdateAppPass} options={{ animation: 'default' }} />
                <Drawer.Screen name="UpdateTransactionPass" component={UpdateTransactionPass} options={{ animation: 'default' }} />
            </Drawer.Navigator>
        </UserContext.Provider>
    );
}
