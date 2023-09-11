
import React, {useState} from 'react';

import {
    Text,
    View,
    TextInput,
    Button,
    ActivityIndicator,
    Alert
} from 'react-native';

import { login } from '../API';
import style from '../style';

export default function LoginScreen({navigation}) {

    const [loading, setLoading] = useState(false);

    const log = (email, password) => {
        setLoading(true);
        login(email, password)
            .then(function (response) {
                access_token = response.data;
                navigation.navigate('home', { token: response.data.access_token})
                setLoading(false);
                console.log(response.data.access_token);
                try {
                    AsyncStorage.setItem('token', response.data.access_token, () => {
                        console.log('token saved');
                    });
                } catch (e) {
                    console.log(e);
                }
            })
            .catch(function (error) {
                console.log(error);
                setLoading(false);
                Alert.alert('Error', 'Wrong email or password');
            })
    }

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    return (
        <View
            style={{
                padding: 20
            }}
        >
            <Text>Welcome to Links</Text>
            <View style={style.login_box}>
                <Text>Email</Text>
                <TextInput
                    style={style.input}
                    keyboardType='email-address'
                    onChangeText={setEmail}
                    value={email}
                    placeholder="Email"
                />
                <Text>Password</Text>
                <TextInput
                    secureTextEntry={true}
                    style={style.input}
                    onChangeText={setPassword}
                    value={password}
                    placeholder="Password"
                />
                <View
                    style={{
                        height: 80,
                        justifyContent: 'space-between',
                    }}
                >
                    <Button
                        title='Login'
                        onPress={() => log(email, password)}
                    />
                    <Button
                        title='Debug'
                        onPress={() => navigation.navigate('home', { token: null})}
                    />
                </View>
                {loading &&
                    <View
                        style={{
                            marginTop: 20,
                        }}
                    >
                        <ActivityIndicator size='large' />
                    </View>
                }
            </View>
        </View>
    );
}