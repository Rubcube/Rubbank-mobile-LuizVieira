import { NavigationContainer } from '@react-navigation/native';
import {
    NativeStackNavigationProp,
    createNativeStackNavigator,
} from '@react-navigation/native-stack';
import IndexOnboarding from '../screens/Onboading';
import { OnboadingContext, initialOnboardingState } from '../services/OnboardingContext';
import { useContext, useState } from 'react';
import CepScreen from '../screens/Onboading/cepScreen';
import { OnboardingDTO } from '../types/OnboardingDTO';
import { Text, View } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import AddressScreen from '../screens/Onboading/addressScreen';

const Drawer = createNativeStackNavigator();

type StackOboading = {
    IndexOnboading: undefined;
    CepScreen: undefined;
    AddressScreen: undefined;
}

export type StackOnboardingTypes = NativeStackNavigationProp<StackOboading>;
export default function StackOnboardingComponent(): JSX.Element {
    const [onboarding, setOnboarding] = useState<OnboardingDTO>(initialOnboardingState);
    return (
        <OnboadingContext.Provider value={[onboarding, setOnboarding]} >
            <View style={{paddingHorizontal: 36, paddingTop: 50, backgroundColor: '#FFFFFF'}}>
                <ProgressBar progress={onboarding.progress} color='#6B7AE5'style={{borderRadius: 2}}/>
            </View>

            <Drawer.Navigator screenOptions={{ headerShown: false }}>
                <Drawer.Screen name="IndexOnboading" component={IndexOnboarding} options={{ animation: 'slide_from_left' }} />
                <Drawer.Screen name="CepScreen" component={CepScreen} options={{ animation: 'slide_from_right' }} />
                <Drawer.Screen name="AddressScreen" component={AddressScreen} options={{ animation: 'slide_from_right' }} />
            </Drawer.Navigator>
        </OnboadingContext.Provider>
    );
}
