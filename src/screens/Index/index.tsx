import React, { useContext } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import logo from '../../assets/logo.png';
import DefaultButton from '../../components/DefaultButton';
import { useNavigation } from '@react-navigation/native';
import { StackTypes } from '../../routes/stackNavigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AccountsContext } from '../../services/AccountsContext';

function Index(children: any): JSX.Element {

  const navigation = useNavigation<StackTypes>();
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.content}>
        <Image style={styles.logoImage} source={logo} />
        <View style={styles.action}>
          <Text style={styles.title}>Bem-vindo a RubBank!</Text>
          <Text style={styles.subtitle}>Sua conta digital, sem burocracia.</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <DefaultButton color='#6B7AE5' text='COMEÇAR' />
          </TouchableOpacity>
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
    backgroundColor: '#FFFFFF'
  },
  logoImage: {
    alignSelf: 'center',
    marginTop: 40
  },
  title: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 16,
    color: '#1D1C3E'
  },
  subtitle: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    textAlign: 'center',
    fontSize: 16,
    color: '#1D1C3E',
    marginBottom: 20
  },
  action: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 60
  }

});

export default Index;
