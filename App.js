/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useRef, useEffect, useState, Component} from 'react';

import {
    useColorScheme,
    View,
    ActivityIndicator,
    Button,
} from 'react-native';

import { createMyNavigator } from './component/Truc';

import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from './screen/Login';
import HomeScreen from './screen/Home';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Widget from './component/Widget';
import Test from './component/Test';
import Time from './component/Time';
import WidgetZone from './component/WidgetZone';

const Stack = createMyNavigator();

const uid = function(){
    return Date.now().toString(36) + Math.random().toString(36);
}

function Zone(props) {
    const { widgets } = props;

    const x = useRef();
    const y = useRef();
    const width = useRef();
    const height = useRef();

    const unit = useRef();
    const unitSize = useRef();

    const grid = useRef([]);

    const [padding, setPadding] = useState(null);
    // debug
    const [_grid, setGrid] = useState([]);

    const calculate = () => {
        const _unit = {x: Math.floor(width.current / 70), y: Math.floor(height.current / 70) - 1};
        const _size = Math.floor(width.current / _unit.x);

        unit.current = _unit;
        unitSize.current = _size;

        pad = {
            x: Math.floor((width.current - (_size * _unit.x)) / 2),
            y: Math.floor((height.current - (_size * _unit.y)) / 2)
        };

        const _grid = [];

        for (let i = 0; i < _unit.x; i++) {
            let row = [];
            for (let j = 0; j < _unit.y; j++) {
                _grid.push({x: i, y: j});
                row.push(null);
            }
            grid.current.push(row);
        }

        setPadding(pad);
        setGrid(_grid);
    }

    return (
        <View
            onLayout={(event) => {
                const {x: _x, y: _y, width: _width, height: _height} = event.nativeEvent.layout;
                x.current = _x;
                y.current = _y;
                width.current = Math.floor(_width);
                height.current = Math.floor(_height);
                calculate();
            }}
            style={{
                width: '100%',
                height: '100%',
                paddingHorizontal: padding ? padding.x : 0,
                paddingVertical: padding ? padding.y : 0,
            }}
        >
            {padding != null ?
                <>
                    {_grid.map((data) => {
                        return <View
                            key={uid()}
                            style={{
                                position: 'absolute',
                                top: data.y * unitSize.current,
                                left: data.x * unitSize.current,
                                width: unitSize.current,
                                height: unitSize.current,
                                padding: 5
                            }}
                        >
                            <View style={{
                                backgroundColor: '#00440080',
                                width: '100%',
                                height: '100%'
                            }}/>
                        </View>
                    })}
                    {widgets.map((widget) => {
                        return widget.render(
                            {props: {
                                key: uid(),
                                x: x,
                                y: y,
                                width: width,
                                height: height,
                                unit: unit,
                                size: unitSize,
                            }, ...widget}
                        );
                    })}
                </>
                :
                <></>
            }
        </View>
    )
}

class Wix extends Component {
    constructor(props) {
        super(props);
        console.log(props);
    }

    Test() {
        console.log("test");
    }

    render() {
        return (
            <></>
        )
    }
}

function App() {
    const isDarkMode = useColorScheme() === 'dark';

    const [loading, setLoading] = useState(true);
    const [acc_token, setToken] = useState(null);

    const zone = useRef(null);

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

    // <NavigationContainer>
    //     <Stack.Navigator initialRouteName={acc_token ? 'home' : 'login'} >
    //         <Stack.Screen name='login' component={LoginScreen}/>
    //         <Stack.Screen name='home' component={HomeScreen}/>
    //     </Stack.Navigator>
    // </NavigationContainer>

    const data = [
        {
            type: Time,
            initial: {
                x: 0,
                y: 1,
                width: 3,
                height: 3,
            }
        }
    ]

    return (
        <WidgetZone widgets={data} data={zone}/>
    );
}

export default App;
