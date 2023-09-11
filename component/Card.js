import React from 'react';
import { View, styleheet, Image, Text, Pressable } from 'react-native';

import style from '../style';

const Cards = (props) => {
    return (
        <View style={style.cards}>
            <View style={style.card_container}>
                <Pressable>
                    <Image
                        style={style.profile}
                        borderRadius={500}
                        source={require("../assets/Blank-Avatar.png")}
                        alt='Profile'
                    />
                </Pressable>
                <Pressable>
                    <Text style={style.name}>{props.name}</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default Cards
