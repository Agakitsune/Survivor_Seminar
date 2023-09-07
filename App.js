/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useRef, useEffect, useState} from 'react';
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
    PanResponder
} from 'react-native';

import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import StyleConfig from './StyleConfig';

import ToolBar from './component/ToolBar';
import Drag from './component/Drag';
import Drop from './component/Drop';

import { createMyNavigator } from './component/Truc';
import { NavigationContainer } from '@react-navigation/native';

function Thing() {

    const [position, setPosition] = useState({x: 0, y: 0});
    const [width, setWidth] = useState(150);
    const [height, setHeight] = useState(150);

    const pan = useRef(new Animated.ValueXY(position)).current;
    const widthAnim = useRef(new Animated.Value(width)).current;
    const heightAnim = useRef(new Animated.Value(height)).current;

    widthAnim.addListener((value) => setWidth(value.value));
    heightAnim.addListener((value) => setHeight(value.value));
    pan.addListener((value) => setPosition(value));

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                console.log(position) 
            },
            // onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}], {useNativeDriver:false}),
            onPanResponderMove: (e, gesture) => {
                click = {x: gesture.x0 - position.x, y: gesture.y0 - position.y};

                // console.log(click);
                // console.log(position);

                action = Animated.event([null, {dx: pan.x, dy: pan.y}], {useNativeDriver:false});
                if (click.x <= 20 && click.y <= 20) {
                    action = (e, gesture) => {
                        Animated.event([null, {dx: pan.x, dy: pan.y}], {useNativeDriver:false})(e, gesture);
                        Animated.event([null, {dx: widthAnim, dy: heightAnim}], {useNativeDriver:false})(e, gesture);
                    }
                }

                action(e, gesture); 
            },
            onPanResponderRelease: () => {
                pan.extractOffset();
            }
        }),
    ).current;

    // console.log(position);

    return (
        <Animated.View
            style={{
                // transform: [{translateX: pan.x}, {translateY: pan.y}],
                position: 'absolute',
                top: position.y,
                left: position.x,
            }}
            {...panResponder.panHandlers}
        >
            <View
                style={{
                    backgroundColor: '#b784a740',
                    width: width,
                    height: height,
                    padding: 10,
                }}
            >
                <View
                    style={{
                        backgroundColor: '#d9d9d9',

                        width: '100%',
                        height: '100%',
                        borderRadius: 10,
                    }}
                >
                    <View
                        style={{
                            position: 'absolute',
                            backgroundColor: '#00ffff',
                            width: 16,
                            height: 16,
                            top: -8,
                            left: -8,
                            borderRadius: 10,
                        }}
                    />
                    <View
                        style={{
                            position: 'absolute',
                            backgroundColor: '#00ffff',
                            width: 16,
                            height: 16,
                            top: -8,
                            left: width - 28,
                            borderRadius: 10,
                        }}
                    />
                    <View
                        style={{
                            position: 'absolute',
                            backgroundColor: '#00ffff',
                            width: 16,
                            height: 16,
                            top: height - 28,
                            left: - 8,
                            borderRadius: 10,
                        }}
                    />
                    <View
                        style={{
                            position: 'absolute',
                            backgroundColor: '#00ffff',
                            width: 16,
                            height: 16,
                            top: height - 28,
                            left: width - 28,
                            borderRadius: 10,
                        }}
                    />
                </View>
            </View>
        </Animated.View>
    )
}

function Hmm() {
    const pan = useRef(new Animated.ValueXY()).current;

    const width = useRef(new Animated.Value(150)).current;
    const height = useRef(new Animated.Value(150)).current;

    const [__width, setWidth] = useState(150);
    const [__height, setHeight] = useState(150);

    width.addListener((value) => setWidth(value.value));
    height.addListener((value) => setHeight(value.value));

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            // onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}], {useNativeDriver:false}),
            onPanResponderMove: Animated.event([null, {dx: width, dy: height}], {useNativeDriver:false}),
            onPanResponderRelease: () => {
                Animated.spring(pan, {
                    toValue: {x: 0, y: 0},
                    friction: 1,
                    useNativeDriver: true,
                }).start();
                Animated.spring(width, {
                    toValue: __width + 50,
                    friction: 1,
                    useNativeDriver: true,
                }).start();
                Animated.spring(height, {
                    toValue: __height + 50,
                    friction: 1,
                    useNativeDriver: true,
                }).start();
            }
        }),
    ).current;

    return (
        <View style={styles.container}>
        <Text style={styles.titleText}>Drag & Release this box!</Text>
        <Animated.View
            style={{
                transform: [{translateX: pan.x}, {translateY: pan.y}],
            }}
            {...panResponder.panHandlers}
        >
            <View style={{
                width: __width,
                height: __height,
                backgroundColor: 'blue',
                borderRadius: 5,
            }} />
        </Animated.View>
        </View>
    );
}

function HomeScreen() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Home Screen</Text>
        </View>
    );
}

const Stack = createMyNavigator();

function App() {
    const isDarkMode = useColorScheme() === 'dark';

    const drop = new Drop({x: 0, y: 0}, {x: 500, y: 500}, 150)

    return (
        <View style={styles.container}>
            <Drag />
        </View>
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
});

export default App;
