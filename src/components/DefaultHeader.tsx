import { TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import { styled } from "styled-components";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { ReactNode } from "react";

const Header = styled(View)`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 25px;
`;

interface Props {
    title: string
    backFunction: () => void
    secondIcon?: ReactNode
    secondFunction?: () => void
}

const DefaultHeader = (props: Props) => {
    return (
        <Header>
            <TouchableOpacity onPress={props.backFunction}>
                <AntDesign name="arrowleft" color={'#FFFFFF'} size={20} />
            </TouchableOpacity>
            <Text style={{ color: '#FFFFFF', fontSize: 24 }}>{props.title}</Text>
            {
                props.secondIcon ?
                    <TouchableOpacity onPress={props.secondFunction}>
                        {props.secondIcon}
                    </TouchableOpacity> :
                    <AntDesign name="arrowleft" color={'rgba(0,0,0,0)'} size={20} />
            }

        </Header>
    );
}

export default DefaultHeader;