import { useContext, useEffect, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styled } from "styled-components";
import DefaultButton from "../../components/DefaultButton";
import InputField from "../../components/InputField";
import { FieldValues, useForm } from "react-hook-form";
import { maskData } from "../../utils/masks";
import { Filters } from "../../types/TransactionsDTO";
import { DateTime } from 'luxon';
import { ChangeFilterContext, FilterContext } from "./services/filtersContext";

interface CardProps {
    selected: boolean
}

const Card = styled(View) <CardProps>`
    width: 70px;
    height: 70px;
    border-width: ${props => props.selected ? '2px' : '1px'};
    border-style: solid;
    border-color: ${props => props.selected ? '#383838' : '#AAABAB'};
    align-items: center;
    justify-content: center;
    border-radius: 12px;
`;

const CardText = styled(Text)`
    font-size: 18px;
    font-weight: 700;
`;

interface InputRadiusProps {
    isMarked: boolean
}

const InputRadius = styled(View) <InputRadiusProps>`
    width: 24px;
    height: 24px;
    border-width: 2px;
    border-style: solid;
    border-color: ${props => props.isMarked ? '#1D1C3E' : '#AAABAB'};
    border-radius: 12px;
    align-items: center;
    justify-content: center;
`;

const Mark = styled(View)`
    width: 14px;
    height: 14px;
    border-radius: 7px;
    background-color: #1D1C3E;
`;

const Separator = styled(View)`
    height: 1px;
    background-color: #AAABAB;
    width: 100%;
`;

interface Props {
    visibility: boolean
    setVisibility: () => void
}

export const FilterModal = (props: Props) => {
    const [older, setOlder] = useState(false);
    const [newest, setNewest] = useState(false);
    const [isDrop, setIsDrop] = useState(false);
    const [dataOption, setDataOption] = useState([false, false, false, false]);
    const { register, setValue, handleSubmit, watch } = useForm();
    const [filters, setFilters] = useContext(FilterContext);
    const [changeFilter, setChangeFilter] = useContext(ChangeFilterContext)

    const [isFormValid, setIsFormValid] = useState(false);

    const [errorMsg, setErrorMsg] = useState({
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        register('startDate');
        register('endDate');
    }, [register])

    useEffect(() => {
        if (dataOption.find(element => element) ||
            newest || older || (watch('startDate') && errorMsg.startDate === '') ||
            (watch('endDate') && errorMsg.endDate === '')) setIsFormValid(true);
        else setIsFormValid(false);
    }, [dataOption, newest, older, errorMsg])

    const dateValidation = (field: string) => {
        if (!watch(field)) { mapError('', field); return; }

        const date = DateTime.fromFormat(watch(field), 'dd/MM/yyyy');
        if (!date.isValid) mapError('Digite uma data válida', field);
        else if (date < DateTime.fromISO('2023-01-01')) mapError('Digite uma data válida', field);
        else mapError('', field);

        setDataOption([false, false, false, false])
    }

    const mapError = (msg: string, field: string) => {
        if (field === 'startDate') setErrorMsg({ ...errorMsg, startDate: msg })
        else setErrorMsg({ ...errorMsg, endDate: msg })
    }

    const toggleOrder = (inputPressed: () => void) => {
        setOlder(false);
        setNewest(false);
        inputPressed();
    }

    const toggleDataOption = (index: number) => {
        let options = [false, false, false, false];
        options[index] = !dataOption[index];
        setDataOption(options);
        setValue('startDate', '');
        setValue('endDate', '');
        setIsDrop(false);
        setErrorMsg({ endDate: '', startDate: '' })
    }

    const clearFilters = () => {
        setDataOption([false, false, false, false]);
        setOlder(false);
        setNewest(false);
        setValue('startDate', undefined);
        setValue('endDate', undefined);

        setFilters({
            ...filters,
            endDate: undefined,
            startDate: undefined,
            scheduleStartDate: undefined,
            scheduleEndDate: undefined,
            order: 'desc'
        })

        setChangeFilter(!changeFilter);
        props.setVisibility();
    }

    const onSubmit = (data: FieldValues) => {
        const calcDate: number | undefined = dataOption[0] ? 15 : dataOption[1] ? 30 : dataOption[2] ? 60 : dataOption[3] ? 90 : undefined;

        let startDate = calcDate ? DateTime.now().minus({ days: calcDate }) : undefined;
        let endDate = DateTime.now();
        let scheduleStartDate = DateTime.now();
        let scheduleEndDate = calcDate ? DateTime.now().plus({ days: calcDate }) : undefined;

        if (data.startDate || data.endDate) {
            startDate = data.startDate ? DateTime.fromFormat(data.startDate, 'dd/MM/yyyy') : DateTime.now();
            endDate = data.endDate ? DateTime.fromFormat(data.endDate, 'dd/MM/yyyy') : DateTime.now();

            if (startDate.startOf('day') > endDate.startOf('day')) { setErrorMsg({ ...errorMsg, startDate: 'Digite um período válido' }); return; }
            if (endDate.diff(startDate, 'days').days > 90) { setErrorMsg({ ...errorMsg, startDate: 'Digite um período válido' }); return; }

            scheduleStartDate = startDate;
            scheduleEndDate = endDate;

        }

        setFilters({
            ...filters,
            endDate: endDate.toJSDate(),
            startDate: startDate ? startDate.toJSDate() : undefined,
            scheduleStartDate: scheduleStartDate.toJSDate(),
            scheduleEndDate: scheduleEndDate ? scheduleEndDate.toJSDate() : undefined,
            order: older ? 'asc' : 'desc'
        })

        setChangeFilter(!changeFilter);
        props.setVisibility();
    }


    return (
        <Modal visible={props.visibility} onRequestClose={props.setVisibility} transparent={true} animationType="slide">
            <View style={styles.Container}>
                <ScrollView>
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={props.setVisibility}>
                                <Ionicons name="close" size={24} />
                            </TouchableOpacity>
                            <Text style={styles.Title}>Filtro</Text>
                            <Ionicons name="close" size={24} color={'rgba(0,0,0,0)'} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ marginTop: 50, marginHorizontal: 10, gap: 20 }}>
                                <View style={{ gap: 5 }}>
                                    <Text style={styles.Title}>Período</Text>
                                    <Text style={{ fontSize: 16, fontWeight: '400' }}>Período máximo de 90 dias a partir da data inicial</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <TouchableOpacity onPress={() => toggleDataOption(0)}>
                                        <Card selected={dataOption[0]}><CardText>15</CardText><CardText>dias</CardText></Card>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => toggleDataOption(1)}>
                                        <Card selected={dataOption[1]}><CardText>30</CardText><CardText>dias</CardText></Card>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => toggleDataOption(2)}>
                                        <Card selected={dataOption[2]}><CardText>60</CardText><CardText>dias</CardText></Card>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => toggleDataOption(3)}>
                                        <Card selected={dataOption[3]}><CardText>90</CardText><CardText>dias</CardText></Card>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }} onPress={() => setIsDrop(!isDrop)}>
                                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#F1580C' }}>outros períodos</Text>
                                    {isDrop ? <Ionicons name="chevron-up" size={24} /> : <Ionicons name="chevron-down" size={24} />}
                                </TouchableOpacity>

                                {isDrop &&
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 20 }}>
                                        <View style={{ flex: 1 }}>
                                            <InputField
                                                fieldName="startDate"
                                                isRequired={errorMsg.startDate !== ''}
                                                requireMsg={errorMsg.startDate}
                                                keyboardType="default"
                                                label="Data inicial"
                                                placeholder=""
                                                placeholderTextColor="#FFFFFF"
                                                secureTextEntry={false}
                                                setValue={setValue}
                                                mask={maskData}
                                                maxLength={10}
                                                validationFunction={() => dateValidation('startDate')}
                                            />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <InputField
                                                fieldName="endDate"
                                                isRequired={errorMsg.endDate !== ''}
                                                requireMsg={errorMsg.endDate}
                                                keyboardType="default"
                                                label="Data final"
                                                placeholder=""
                                                placeholderTextColor="#FFFFFF"
                                                secureTextEntry={false}
                                                setValue={setValue}
                                                mask={maskData}
                                                maxLength={10}
                                                validationFunction={() => dateValidation('endDate')}
                                            />
                                        </View>
                                    </View>
                                }

                                <Text style={styles.Title}>Por ordem</Text>
                                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}
                                    onPress={() => toggleOrder(() => setOlder(!older))}>
                                    <Text style={{ fontSize: 18, fontWeight: '400' }}>Mais antigos</Text>
                                    <InputRadius isMarked={older}>{older && <Mark />}</InputRadius>
                                </TouchableOpacity>
                                <Separator />
                                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                                    onPress={() => toggleOrder(() => setNewest(!newest))}>
                                    <Text style={{ fontSize: 18, fontWeight: '400' }}>Mais novos</Text>
                                    <InputRadius isMarked={newest}>{newest && <Mark />}</InputRadius>
                                </TouchableOpacity>
                            </View>
                            <View style={{ alignItems: 'center', gap: 20, justifyContent: 'flex-end', flex: 1, marginTop: 50 }}>
                                <TouchableOpacity disabled={!isFormValid} onPress={handleSubmit(onSubmit)}>
                                    <DefaultButton color={isFormValid ? "#1D1C3E" : "#CCCCCC"} text="CONTINUAR" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={clearFilters}>
                                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#F1580C' }}>Limpar Filtro</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </Modal >
    );
}


const styles = StyleSheet.create({
    Container: {
        backgroundColor: "#FFFFFF",
        flex: 1,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        marginTop: 25,
        padding: 30
    },
    Title: {
        fontSize: 18,
        fontWeight: '700'
    }
})