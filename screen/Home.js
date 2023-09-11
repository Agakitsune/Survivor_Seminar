
import React, {useEffect, useState} from 'react';

import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    Button
} from 'react-native';

import Widget from '../component/Widget';
import Swiper from 'react-native-swiper';

import Cards from '../component/Card';

import { getEmployees } from '../API';
import style from '../style';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ToolBar from '../component/ToolBar';

import StyleConfig from '../StyleConfig';
import WidgetZone from '../component/WidgetZone';

export default function HomeScreen({route, navigation}) {

    const { token } = route.params;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [data, setData] = useState([
        { name: 'toto'}
    ]);

    const [edit, setEdit] = useState(false);

    useEffect(() => {
        getEmployees(token)
            .then((res) => {
                setData(res.data);
                setLoading(false);
            }).catch((err) => {
                console.log(err);
                setError(true);
                setLoading(false);
            });
    }, []);

    tools = {
        left: [],
        right: []
    };

    if (edit) {
        tools.left = [
            {
                name: 'arrow-left',
                action: (event) => {
                    setEdit(false);
                }
            }
        ]
        tools.right = [
            {
                name: 'arrow-u-left-top',
                disabled: true
            },
            {
                name: 'arrow-u-right-top',
                disabled: true
            },
            {
                name: 'plus',
                disabled: true
            },
            {
                name: 'check',
                disabled: true
            }
        ]
    } else {
        tools.right = [
            {
                name: 'pencil',
                action: (event) => {
                    setEdit(true);
                }
            }
        ]
    }

    return (
        <Swiper loop={false} showsPagination={false} scrollEnabled={!edit}>
            <View>
                <ToolBar
                    height={45}
                    config={StyleConfig.toolbar}
                    icon={{
                        iconSize: 40,
                        iconWidth: 50,
                    }}
                    leftTools={tools.left}
                    rightTools={tools.right}
                />
                <View>
                    <WidgetZone />
                    {/* <Widget edit={edit}/> */}
                </View>
            </View>
            <View>
                {loading ? 
                    <View
                        style={{
                            height: '100%',
                            justifyContent: 'center'
                        }}
                    >
                        <ActivityIndicator size='large' />
                    </View>
                    :
                    error ? 
                        <View
                            style={{
                                height: '100%',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Icon name='traffic-cone' color='#d9d9d9' size={60} style={{
                                alignSelf: 'center'
                            }} />
                            <Text style={{fontSize:20}} >Oops</Text>
                            <Text style={{fontSize:14, margin: 20}} >Something went wrong...</Text>
                            <Button
                                title='Load debug data'
                                onPress={() => {
                                    setData([
                                        {name: 'toto'},
                                        {name: 'tata'},
                                        {name: 'denix'}
                                    ])
                                    setError(false)
                                }}
                            />
                        </View>
                        :
                        <FlatList
                            data={data}
                            renderItem={({item}) => <Cards name={item.name} />}
                        />
                }
            </View>
        </Swiper>
    );
}
