import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, Pressable, ActivityIndicator } from 'react-native';
import axios from 'axios';

function getImage(id, access_token) {
    const headers = {
        'accept': 'image/png',
        'X-Group-Authorization': 'oNLNtdimPh8oE_Qi-dBQDvujQsSm7tMN',
        'Authorization': 'Bearer ' + access_token
    };
    return (axios.get('https://masurao.fr/api/employees/' +  id + '/image', {responseType: 'blob', headers}))
}

const Cards = (props) => {
    
    const [image, setImage] = React.useState(null);

    React.useEffect(() => {
        getImage(props.id, props.token)
            .then(function (response) {
                let reader = new FileReader();
                reader.readAsDataURL(response.data);
                reader.onloadend = () => {
                    setImage(reader.result.toString());
                }
            })
    }, [])

    return (
        <View style={styles.cards}>
            <Pressable style={{
                borderRightColor: 'black',
                borderRightWidth: 1,
                height: '100%',
                width : 65
            }}>
                {image ?
                    <Image style={styles.profile}
                        borderRadius={500}
                        source={{uri:image}}
                        alt='Profile'
                    />
                    :
                    <ActivityIndicator />
                }
            </Pressable>
            <Pressable style={{
                width: '75%'
            }}>
                <Text style={styles.name}>{props.name}</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    cards: {
        flex: 1,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: '#808080',
        margin: '1%',
        height: 70,
        width: 'auto',
    },
    profile: {
        flex: 1,
        height: '100%',
        width: '100',
        margin: '5%'
    },
    name: {
        flex: 1,
        textAlignVertical: 'center',
        marginLeft: '5%',
    },
});

export default Cards
