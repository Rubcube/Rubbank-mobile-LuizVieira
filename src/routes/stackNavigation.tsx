import { NavigationContainer } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import Index from '../screens/Index';
import Login from '../screens/Login';
import Accounts from '../screens/Accounts';
import { AccountsContext } from '../services/AccountsContext';
import { useState } from 'react';
import AccountsDTO from '../types/AccountDTO';
import HomeScreen from '../screens/HomeScreen/index.';
import { ActiveAccountContext } from '../services/ActiveAccountContext';
import StackOnboardingComponent from './stackOnboarding';
import StackPerfilComponent from './stackPerfil';
import { AuthContext } from '../services/AuthContext';
import Extrato from '../screens/Extrato/Index';
import DetailedTransfer from '../screens/Extrato/detailedTransfer';

const Stack = createNativeStackNavigator();

type StackNavigation = {
  Home: undefined;
  Login: undefined;
  Onboarding: undefined;
  Accounts: undefined;
  HomeScreen: undefined;
  Perfil: undefined;
  Extrato: undefined;
  DetailedTransfer: {id: string};
}

export type StackTypes = NativeStackNavigationProp<StackNavigation>;
export default function StackComponent(): JSX.Element {
  const [accounts, setAccounts] = useState<AccountsDTO[]>([]);
  const [activeAccount, setActiveAccount] = useState<AccountsDTO>({
    account_number: -1,
    agency: '',
    id: ''
  });
  const [auth, setAuth] = useState('');
  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      <AccountsContext.Provider value={[accounts, setAccounts]}>
        <ActiveAccountContext.Provider value={[activeAccount, setActiveAccount]}>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Index" component={Index} options={{ animation: 'slide_from_left' }} />
              <Stack.Screen name="Login" component={Login} options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="Onboarding" component={StackOnboardingComponent} options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="Accounts" component={Accounts} options={{ animation: 'slide_from_bottom' }} />
              <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ animation: 'simple_push' }} />
              <Stack.Screen name="Perfil" component={StackPerfilComponent} options={{ animation: 'default' }} />
              <Stack.Screen name='Extrato' component={Extrato} options={{ animation: 'default' }} />
              <Stack.Screen name='DetailedTransfer' component={DetailedTransfer} options={{ animation: 'default' }} />
            </Stack.Navigator>
          </NavigationContainer>
        </ActiveAccountContext.Provider>
      </AccountsContext.Provider >
    </AuthContext.Provider>
  );
}
