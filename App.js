/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useRef, useEffect, useState} from 'react';
import axios from 'axios'

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    TouchableNativeFeedback,
    Animated,
    PanResponder,
    TextInput,
    Button,
    ActivityIndicator,
    Alert
} from 'react-native';

import StyleConfig from './StyleConfig';

import ToolBar from './component/ToolBar';
import Drag from './component/Drag';
import Drop from './component/Drop';

import { createMyNavigator } from './component/Truc';
import { NavigationContainer } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import Cards from './component/Card';

function login(email, password) {
  const headers = {
    'accept': 'application/json',
    'X-Group-Authorization': 'oNLNtdimPh8oE_Qi-dBQDvujQsSm7tMN',
    'Content-Type': 'application/json'
  }

  return (axios.post('https://masurao.fr/api/employees/login', {email, password}, {headers}))
}

function getEmployees() {
  const headers = {
    'accept': 'application/json',
    'X-Group-Authorization': 'oNLNtdimPh8oE_Qi-dBQDvujQsSm7tMN',
    'Authorization': 'Bearer ' + access_token
  };

  return (axios.get('https://masurao.fr/api/employees', {headers}))
}

function HomeScreen({navigation, router}) {

    const [acc_token, setToken] = useState(null);

    useEffect(() => {
        try {
            const tok = AsyncStorage.getItem('token');
            console.log(tok);
            if (tok != null && typeof tok == 'string') {
                setToken(tok);
            }
        } catch (e) {
            console.log(e);
        }
    }, []);

    return (
        <View>
            <Drag />
            { acc_token && <Text>{acc_token}</Text> }
        </View>
    );
}

function LoginScreen({navigation}) {

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
            <Text>Welcome to ???</Text>
            <View style={styles.login_box}>
                <Text>Email</Text>
                <TextInput
                    style={styles.input}
                    keyboardType='email-address'
                    onChangeText={setEmail}
                    value={email}
                    placeholder="Email"
                />
                <Text>Password</Text>
                <TextInput
                    secureTextEntry={true}
                    style={styles.input}
                    onChangeText={setPassword}
                    value={password}
                    placeholder="Password"
                />
                <Button
                    title='Login'
                    onPress={() => log(email, password)}
                />
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

const Stack = createMyNavigator();

function App() {
    const isDarkMode = useColorScheme() === 'dark';

    const drop = new Drop({x: 0, y: 0}, {x: 500, y: 500}, 150)

    const [loading, setLoading] = useState(true);
    const [acc_token, setToken] = useState(null);

    useEffect(() => {
        try {
            const tok = AsyncStorage.getItem('token');
            console.log(tok);
            if (tok != null && typeof tok == 'string') {
                setToken(tok);
            }
            setLoading(false);
        } catch (e) {
            console.log(e);
        }
    }, []);

    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <ActivityIndicator size='large' />
            </View>
        )
    }

    console.log(acc_token);

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={acc_token ? 'home' : 'login'} >
                <Stack.Screen name='login' component={LoginScreen}/>
                <Stack.Screen name='home' component={HomeScreen} options={{token : acc_token}} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleText: {
        fontSize: 14,
        lineHeight: 24,
        fontWeight: 'bold',
    },
    box: {
        backgroundColor: 'blue',
        borderRadius: 5,
    },
    logo: {

    },
    input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    },
    login_box: {

    },
    button: {

    }
});

export default App;
