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
        <Card style={{ elevation: 2 }}>
            <Image source={props.image} />
            <Text>{props.title}</Text>
        </Card>
    );
}

export default MenuItem;