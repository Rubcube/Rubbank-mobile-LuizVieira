import React, { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import StackComponent from './routes/stackNavigation';
import { StatusBar } from 'react-native';

function App(): JSX.Element {

  useEffect(() => {
    SplashScreen.hide();
  }, [])

  return (
    <>
      <StatusBar/>
      <StackComponent />
    </>
  );
}

export default App;
