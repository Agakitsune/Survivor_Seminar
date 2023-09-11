
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
    const { disabled } = props;

    const [longPress, setLongPress] = useState(false);
    const [pressed, setPressed] = useState(false);

    return (
        <Pressable
            disabled={disabled}
            onPress={(event) => {
                if (longPress) {
                    longAction ? longAction(event) : action ? action(event) : null;
                } else {
                    action ? action(event) : null;
                }
                setLongPress(false);
            }}
            onLongPress={() => {
                setLongPress(true)
            }}
            android_ripple={{
                borderless: false,
                color: config.ripple
            }}
            style={{
                backgroundColor: pressed ? config.alt : config.main,
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
                <Icon name={icon} color={iconColor ? iconColor : disabled ? config.disabled : config.icon} size={size} />
            </View>
        </Pressable>
    );
}

export default IconButton;