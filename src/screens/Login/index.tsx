import React, { useEffect, useState } from 'react';
import {  Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import logo from '../../assets/logo.png';
import DefaultButton from '../../components/DefaultButton';
import InputField from '../../components/InputField';
import ErrorModal from '../../components/ErrorModal';
import SuccessModal from '../../components/SuccessModal';


function Login(): JSX.Element {

  const [errVisibility, setErrVisibility] = useState(false);
  const [successVisibility, setSuccessVisibility] = useState(false);

  const changeErrVisibility = () => {
    setErrVisibility(!errVisibility); 
  }

  const changeSuccessVisibility = () => {
    setSuccessVisibility(!successVisibility);
  }

  return (
    <>
    <ErrorModal visibility={errVisibility} errorMsg='Usuário e/ou senha inválidos' setVisibility={changeErrVisibility}/>

    <SuccessModal 
        visibility={successVisibility} 
        btnText='CONTINUAR' 
        successTitle='Logado com sucesso'
        actionButton={changeSuccessVisibility}
        />

    <View style={styles.content}>
      <Image style={styles.logoImage} source={logo} resizeMode='contain'/>
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
          />

      <InputField 
          keyboardType='default' 
          secureTextEntry={true}
          placeholder='Insira sua senha'
          placeholderTextColor={'#AAABAB'}
          label='Senha'
          />

      <Text style={styles.anchorText}>Esqueceu a sua senha?</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => setErrVisibility(!errVisibility)}>
          <DefaultButton text='CONFIRMAR' color='#1D1C3E'/>
        </TouchableOpacity>
        <TouchableOpacity onPress={changeSuccessVisibility}><Text style={styles.anchorText}>Crie sua conta</Text></TouchableOpacity>
      </View>
    </View>
    </>
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
    padding: 40,
    gap: 40
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
    gap: 20,
    marginTop: 175
  },
  anchorText: {
    fontFamily: 'Roboto',
    fontWeight: '600',
    fontSize: 16,
    color: '#6B7AE5'
  }
});

export default Login;
