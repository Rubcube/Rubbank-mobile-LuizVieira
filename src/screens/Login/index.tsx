import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, Image, Keyboard, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';

import logo from '../../assets/logo.png';
import DefaultButton from '../../components/DefaultButton';
import InputField from '../../components/InputField';
import ErrorModal from '../../components/ErrorModal';
import SuccessModal from '../../components/SuccessModal';
import login from './services/authRequest';

import { validateCpf } from '../../services/validateFields';
import { maskCpf } from '../../utils/masks';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoadingScreen } from '../../components/LoadingScreen';
import { StackTypes } from '../../routes/stackNavigation';
import { AccountsContext } from '../../services/AccountsContext';

function Login(): JSX.Element {
  const navigation = useNavigation<StackTypes>();

  const [accounts, setAccounts] = useContext(AccountsContext);

  const { register, setValue, handleSubmit } = useForm();

  /* Visibility and required field states */
  const [cpfIsNull, setCpfIsNull] = useState(false);
  const [passwordIsNull, setPasswordIsNull] = useState(false);

  const [loadingVisibility, setLoadingVisibility] = useState(false);

  const [errVisibility, setErrVisibility] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const [cpfRequireMsg, setCpfRequireMsg] = useState('');
  const [passwordRequireMsg, setPasswordRequireMsg] = useState('');

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    register('cpf')
    register('password')
  }, [register]);

  const cpfValidator = (data: any) => {
    if (!data.cpf || !validateCpf(data.cpf)) {
      setCpfRequireMsg('CPF Inválido');
      setCpfIsNull(true);
    } else {
      setCpfIsNull(false)
    }
  }

  const onSubmit = async (data: any) => {
    if (!data.cpf || !data.password){
      setPasswordIsNull(!data.password);
      setCpfIsNull(!data.cpf);
      setCpfRequireMsg('Campo Obrigatório');
      setPasswordRequireMsg('Campo Obrigatório');
      return;
    }

    setLoadingVisibility(true);
    const res = await login(data.cpf, data.password);

    if (res.status === 200) {
      setLoadingVisibility(false);

      AsyncStorage.setItem('JWTToken', res.token ? res.token : '');

      if(res.accounts) setAccounts(res.accounts);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Accounts' }],
      });
    }
    else if (res.error) {
      setErrorMsg(res.error[0].message);
      setLoadingVisibility(false);
      setErrVisibility(true);
    }

  }

  const changeErrVisibility = () => {
    setErrVisibility(!errVisibility);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LoadingScreen visibility={loadingVisibility} />
      <ErrorModal
        visibility={errVisibility}
        errorMsg={errorMsg}
        setVisibility={changeErrVisibility} />

      <View style={isKeyboardVisible ? styles.contentMin : styles.content}>
        {!isKeyboardVisible && <Image style={styles.logoImage} source={logo} resizeMode='contain' />}
        <View>
          <Text style={styles.title}>Olá,</Text>
          <Text style={styles.subtitle}>Para acessar digite sua senha.</Text>
        </View>

        <InputField
          keyboardType='numeric'
          placeholder='Insira seu CPF aqui'
          placeholderTextColor={'#AAABAB'}
          secureTextEntry={false}
          label='CPF'
          setValue={setValue}
          fieldName='cpf'
          maxLength={14}
          mask={maskCpf}
          isRequired={cpfIsNull}
          requireMsg={cpfRequireMsg}
          validationFunction={handleSubmit(cpfValidator)}
        />

        <InputField
          keyboardType='default'
          secureTextEntry={true}
          placeholder='Insira sua senha'
          placeholderTextColor={'#AAABAB'}
          label='Senha'
          setValue={setValue}
          fieldName='password'
          isRequired={passwordIsNull}
          requireMsg={passwordRequireMsg}
        />

        <TouchableOpacity><Text style={styles.anchorText}>Esqueceu a sua senha?</Text></TouchableOpacity>
        <View style={styles.actions}>  
          <TouchableOpacity onPress={handleSubmit(onSubmit)}>
            <DefaultButton text='CONFIRMAR' color='#1D1C3E' />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Onboarding')}><Text style={styles.anchorText}>Crie sua conta</Text></TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    top: 0,
    left: 0,
    flexDirection: 'column',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: '#FFFFFF',
    gap: 30,
    padding: 40
  }, 
  contentMin: {
    flex: 1,
    top: 0,
    left: 0,
    flexDirection: 'column',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: '#FFFFFF',
    gap: 20,
    padding: 20
  },
  logoImage: {
    alignSelf: 'flex-start',
    height: 56,
    width: 162
  },
  title: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    textAlign: 'left',
    fontSize: 20,
    color: '#1D1C3E'
  },
  subtitle: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    textAlign: 'left',
    fontSize: 12,
    color: '#1D1C3E'
  },
  actions: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 20,
  },
  anchorText: {
    fontFamily: 'Roboto',
    fontWeight: '600',
    fontSize: 16,
    color: '#6B7AE5'
  }
});

export default Login;
