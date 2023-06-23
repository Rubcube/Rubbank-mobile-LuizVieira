import { useNavigation } from "@react-navigation/native"
import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { styled } from "styled-components"

interface Props {
    color: string
    text?: string
}

const CustomButton = styled(View)<Props>`
    background-color: ${props => props.color};
    height: 50px;
    width: 288px;
    border-radius: 25px;
    align-items: center;
    justify-content: center;
    align-self: stretch;
`;

const BtnText = styled(Text)`
    text-align: center;
    color: #FFFFFF;
    font-weight: 500;
    font-family: 'Roboto';
`;

const DefaultButton = (props: Props) => {

    return(
        <CustomButton color={props.color}>
            <BtnText>{props.text}</BtnText>
        </CustomButton>
    );
}

export default DefaultButton;