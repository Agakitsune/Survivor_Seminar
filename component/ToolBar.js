
import {
    View,
} from 'react-native';

import IconButton from "./IconButton";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const uid = function(){
    return Date.now().toString(36) + Math.random().toString(36);
}

export default function ToolBar(props) {
    const { width, height } = props;
    const { icon } = props;
    const { iconWidth, iconSize } = icon;
    const { config } = props;
    const { leftTools, rightTools } = props;
    
    const left = leftTools.map((tool) => 
        <IconButton
            key={tool.name + "_" + uid()}
            icon={tool.name}
            size={iconSize}
            action={tool.action}
            longAction={tool.longAction}
            config={StyleConfig}
            width={iconWidth ? iconWidth : height}
            height={height}
        />
    )

    const right = rightTools.map((tool) =>
        <IconButton
            key={tool.name + "_" + uid()}
            icon={tool.name}
            size={iconSize}
            action={tool.action}
            longAction={tool.longAction}
            config={StyleConfig}
            width={iconWidth ? iconWidth : height}
            height={height}
        />
    )

    console.log(left);
    console.log(right);

    return (
        <View
            style={{
                backgroundColor: config.main.background0,
                width: width ? width : 'auto',
                height: height,
                flexDirection: 'row',
                justifyContent: 'space-between',
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    width: 'auto'
                }}
            >
                {left}
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    width: 'auto'
                }}
            >
                {right}
            </View>
        </View>
    );
}
