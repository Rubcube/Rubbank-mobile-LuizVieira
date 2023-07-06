import { FieldValues, UseFormSetValue } from "react-hook-form";
import { KeyboardTypeOptions, Text, TextInput, TouchableOpacity, View } from "react-native";
import { styled } from "styled-components";
import { useEffect, useState } from "react";
import AppIcon from 'react-native-vector-icons/Ionicons';

interface Props {
    label: string,
    keyboardType: KeyboardTypeOptions,
    placeholder: string,
    placeholderTextColor: string,
    secureTextEntry: boolean,
    setValue: UseFormSetValue<FieldValues>
    fieldName: string
    mask?: (text: string) => string
    maxLength?: number
    validationFunction?: () => void
    isRequired: boolean
    requireMsg?: string
    alignment?: "center" | "left" | "right" | "justify"
    value?: string
    editable?: boolean
}

interface InputStyleProps {
    isRequired: boolean
}

const Input = styled(View) <InputStyleProps>`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    justify-self: stretch;
    border-bottom-width: 1px;
    border-bottom-color: ${props => props.isRequired ? "#b60000" : "#00204A"};
    border-style: solid;
`;

const Label = styled(Text) <InputStyleProps>`
    font-size: 12px;
    color: ${props => props.isRequired ? "#b60000" : "#383838"};
`;

export const RequireMsg = styled(Text) <InputStyleProps>`
    display: ${props => props.isRequired ? 'flex' : 'none'};
    margin-top: 10px;
    font-size: 12px;
    color: #b60000;
`;

const InputField = (props: Props) => {

    const [value, setValue] = useState(props.value? props.value: '');
    const [isHidden, setIsHidden] = useState(props.secureTextEntry);

    const handleChange = (text: string) => {
        if (props.mask) text = props.mask(text);
        props.setValue(props.fieldName, text)
        setValue(text);
        props.validationFunction? props.validationFunction(): '';
    }

    useEffect(() => {
        setValue(props.value? props.value: '');
        props.setValue(props.fieldName, value)
    },[props.value])

    return (
        <View style={{gap: 5}}>
            <Label isRequired={props.isRequired}>{props.label}</Label>
            <Input isRequired={props.isRequired}>
                <TextInput
                    keyboardType={props.keyboardType}
                    placeholder={props.placeholder}
                    placeholderTextColor={props.placeholderTextColor === ""? '#AAABAB': props.placeholderTextColor}
                    secureTextEntry={isHidden}
                    onChangeText={text => handleChange(text)}
                    maxLength={props.maxLength}
                    value={value}
                    onBlur={props.validationFunction}
                    style={{ flex: 1, textAlign: props.alignment? props.alignment: 'left' }}
                    editable={props.editable !== undefined? props.editable: true}
                />
                {props.secureTextEntry &&
                    <TouchableOpacity onPress={() => { setIsHidden(!isHidden) }}>
                        <AppIcon name={!isHidden ? "eye" : "eye-off"} size={15} />
                    </TouchableOpacity>
                }
            </Input>
            <RequireMsg isRequired={props.isRequired}>{props.requireMsg}</RequireMsg>
        </View>
    );
}

export default InputField;