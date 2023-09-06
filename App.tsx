/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import axios from 'axios'
import type {PropsWithChildren} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  Alert,
  FlatList,
  Image,
} from 'react-native';

// import {
//   Colors,
//   DebugInstructions,
//   Header,
//   LearnMoreLinks,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';

import Cards from './Card';

// type SectionProps = PropsWithChildren<{
//   title: string;
// }>;

let access_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzQsImVtYWlsIjoib2xpdmVyLmxld2lzQG1hc3VyYW8uanAiLCJuYW1lIjoiT2xpdmVyIiwic3VybmFtZSI6Ikxld2lzIiwiZXhwIjoxNjk1ODI1OTIyfQ.qsD2xio_iKhAuo-T_DoLzRO5gB0KjYVZ5VN_ZgH03m0';

function post(email, password) {
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

function HomeScreen() {
  return (
    <View>
      <Text>Home Screen</Text>

    </View>
  );
}

function LoginScreen() {

  const login = (email, password) => {
    post(email, password)
      .then(function (response) {
        access_token = response.data;
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <View>
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
          onPress={() => login(email, password)}
        />
      </View>
    </View>
  );
}

function App() {

  // const Stack = createNativeStackNavigator();

  const Data = [
    {
      name: 'toto'
    },
    {
      name: 'tata'
    }
  ];

  return (
    <View>
      <FlatList 
        data={Data}
        renderItem={({item}) => <Cards name={item.name}/>}
      />
      <Button title='get' onPress={() => getEmployees()}/>
    </View>
      // <NavigationContainer>
      //   <Stack.Navigator>
      //     <Stack.Screen name='home' component={HomeScreen}/>
      //     <Stack.Screen name='loginScreen' component={LoginScreen}/>
      //   </Stack.Navigator>
      // </NavigationContainer>
  );
}

const styles = StyleSheet.create({

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
