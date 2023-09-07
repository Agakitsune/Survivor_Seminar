/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import axios from 'axios'
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

import Cards from './Card';

let access_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzQsImVtYWlsIjoib2xpdmVyLmxld2lzQG1hc3VyYW8uanAiLCJuYW1lIjoiT2xpdmVyIiwic3VybmFtZSI6Ikxld2lzIiwiZXhwIjoxNjk1ODI1OTIyfQ.qsD2xio_iKhAuo-T_DoLzRO5gB0KjYVZ5VN_ZgH03m0';

function getEmployees() {
  const headers = {
    'accept': 'application/json',
    'X-Group-Authorization': 'oNLNtdimPh8oE_Qi-dBQDvujQsSm7tMN',
    'Authorization': 'Bearer ' + access_token
  };

  return (axios.get('https://masurao.fr/api/employees', {headers}))
}

function App() {

  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    getEmployees()
      .then(function (response) {
        setData(response.data);
        console.log('toto');
        console.log(data);
      })
  }, [])

  return (
    <View>
      <FlatList 
        data={data}
        renderItem={({item}) => <Cards name={item.name} id={item.id} token={access_token}/>}
      />
    </View>
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
