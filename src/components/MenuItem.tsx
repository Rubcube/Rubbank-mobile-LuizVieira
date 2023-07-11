import { Image, ImageSourcePropType, Text, View } from "react-native";
import { styled } from "styled-components";

const Card = styled(View)`
    width: 150px;
    height: 90px;
    background-color: #FFFFFF;
    border-radius: 8px;
    padding: 15px;
    justify-content: space-between;
`;

interface Props {
    image: ImageSourcePropType,
    title: string
}

const MenuItem = (props: Props) => {
    return (
        <Card>
            <Image source={props.image} resizeMode="contain" style={{width: 24, height: 24}}/>
            <Text>{props.title}</Text>
        </Card>
    );
}

export default MenuItem;