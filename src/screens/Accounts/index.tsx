import { SafeAreaView } from 'react-native-safe-area-context';
import Background from '../../components/Background';
import Container from '../../components/Container';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useContext } from 'react';
import { AccountsContext } from '../../services/AccountsContext';
import { AccountCard } from '../../components/AccountCard';

const Accounts = () => {
    const [accounts, setAccounts] = useContext(AccountsContext);
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Background>
                <Container style={{ marginTop: 40, gap: 40 }}>
                    <Text style={styles.title}>Acesse sua conta:</Text>
                    <FlatList
                        data={accounts}
                        renderItem={({ item }) =>
                            <AccountCard
                                id={item.id}
                                agency={item.agency}
                                account_number={item.account_number} />}
                        keyExtractor={item => item.agency}
                    />
                </Container>
            </Background>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    title: {
        fontFamily: 'Roboto',
        fontWeight: '700',
        textAlign: 'left',
        fontSize: 18,
        color: '#1D1C3E'
      }
});

export default Accounts;
