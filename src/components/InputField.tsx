import { KeyboardTypeOptions, Text, TextInput, View } from "react-native";
import { styled } from "styled-components";

interface Props{
    label: string,
    keyboardType: KeyboardTypeOptions,
    placeholder: string,
    placeholderTextColor: string,
    secureTextEntry: boolean
}

const Input = styled(TextInput)`
    border-bottom-width: 1px;
    border-bottom-color: #00204A;
    border-style: solid;
`;

const Label = styled(Text)`
    font-size: 12px;
    color: #383838
`;

const InputField = (props: Props) => {
    return (
        <View>
            <Label>{props.label}</Label>
            <Input 
                keyboardType={props.keyboardType}
                placeholder={props.placeholder}
                placeholderTextColor={props.placeholderTextColor}
                secureTextEntry={props.secureTextEntry}
            />
        </View>
    );
}

export default InputField;