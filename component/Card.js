import React from 'react';
import { View, StyleSheet, Image, Text, Pressable } from 'react-native';

const Cards = (props) => {
    return (
        <View style={styles.cards}>
            <View style={styles.container}>
                <Pressable>
                    <Image
                        style={styles.profile}
                        borderRadius={500}
                        source={require("./assets/Blank-Avatar.png")}
                        alt='Profile'
                    />
                </Pressable>
                <Pressable>
                    <Text style={styles.name}>{props.name}</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cards: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: '#808080',
        margin: 5,
    },
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    profile: {
        height: 50,
        width: 50,
        margin:5,
    },
    name: {
        marginTop: 20,
        marginLeft: 10,
    },
});

export default Cards
