/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    TouchableNativeFeedback
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

type SectionProps = PropsWithChildren<{
    title: string;
}>;



function App(): JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    return (
        <SafeAreaView style={backgroundStyle}>
            <ToolBar config={StyleConfig} height={45} 
                icon={{
                    iconWidth: 55,
                    iconSize: 40
                }}
                leftTools={[
                    {
                        name: 'plus',
                        action: () => {console.log("Hello")}
                    }
                ]}
                rightTools={[
                    {
                        name: 'magnify',
                        action: () => {console.log("Magnify")}
                    },
                    {
                        name: 'account',
                        action: () => {console.log("Magnify")}
                    }
                ]}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
});

export default App;
