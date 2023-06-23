import { Text, TouchableOpacity, View } from "react-native";
import AccountsDTO from "../types/AccountDTO";
import { styled } from "styled-components";
import AppIcon from 'react-native-vector-icons/Feather';
import { ActiveAccountContext } from "../services/ActiveAccountContext";
import { useContext } from "react";
import { StackTypes } from "../routes/stackNavigation";
import { useNavigation } from "@react-navigation/native";

const Card = styled(View)`
    flex: 1;
    justify-self: stretch;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 20px 5px 20px 5px;
    border-radius: 5px 5px 0px 0px;
    border-bottom-width: 1px;
    border-bottom-color: #d1d1d1;
    border-top-width: 1px;
    border-top-color: #d1d1d1;
    border-style: solid;
`;

const CardContent = styled(Text)`
    font-weight: bold;
    align-self: flex-end;
`;

const Label = styled(Text)`
    color: #8d8d8d;
    font-size: 12px;
`;

export const AccountCard = (props: AccountsDTO) => {
    const [activeAccount, setActiveAccount] = useContext(ActiveAccountContext);
    const navigation = useNavigation<StackTypes>();
    return (
        <TouchableOpacity onPress={() => {setActiveAccount(props), navigation.navigate('HomeScreen')}}>
            <Card>
                <View style={{gap: 5}}>
                    <Label>Tipo:</Label>
                    <CardContent>Conta corrente</CardContent>
                </View>
                
                <View style={{gap: 5}}>
                    <Label>Agência:</Label>
                    <CardContent>{props.agency}</CardContent>
                </View>
                <View style={{gap: 5}}>
                    <Label>Conta:</Label>
                    <CardContent>{props.account_number}</CardContent>
                </View>
                <AppIcon name="chevron-right" size={20} />
            </Card>
        </TouchableOpacity>

    );
}