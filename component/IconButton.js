
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import React, {useState} from 'react';
import {
    Pressable,
    View,
} from 'react-native';

function IconButton(props) {
    const { action, longAction } = props;
    const { icon, iconColor, size } = props;
    const { width, height } = props;
    const { config } = props;

    const [longPress, setLongPress] = useState(false);
    const [pressed, setPressed] = useState(false);

    return (
        <Pressable
            onPressIn={() => {
                setLongPress(false);
                setPressed(true);
            }}
            onLongPress={() => {
                setLongPress(true)
            }}
            onPressOut={() => {
                if (longPress) {
                    longAction ? longAction() : action ? action() : null;
                } else {
                    action ? action() : null;
                }
                setPressed(false);
            }}
            android_ripple={{
                borderless: false,
                color: config.ripple.color0
            }}
            style={{
                backgroundColor: pressed ? config.main.color1 : config.main.color0,
                width: width ? width : 'auto',
                height: height ? height : 'auto'
            }}
        >
            <View
                style={{
                    width: width ? width : 'auto',
                    height: height ? height : 'auto',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Icon name={icon} color={iconColor ? iconColor : config.icon.color0} size={size} />
            </View>
        </Pressable>
    );
}

export default IconButton;