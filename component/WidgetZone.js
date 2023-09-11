
import React, { Component, createRef } from "react";
import {
    StyleSheet,
    View,
    PanResponder,
    Animated,
    Text
} from "react-native";
import style from "../style";

const uid = function(){
    return Date.now().toString(36) + Math.random().toString(36);
}

export default class WidgetZone extends Component {
    constructor(props) {
        super(props);

        this.unit = {
            x: 0,
            y: 0
        }
        this.unitSize = 0;

        this.state = {
            padding: {
                x: 0,
                y: 0
            },
            widgets: props.widgets,
            grid: [],
            data: []
        }

        console.log(props);
        this.data = props.data;
    }

    static getDerivedStateFromProps(props, state) {
        state.widgets = props.widgets;
        state.data = [];
        state.widgets.forEach(widget => {
            state.data.push(JSON.parse(JSON.stringify(widget.initial)));
        });
        return state;
    }

    calculate(width, height) {
        this.unit = {x: Math.floor(width / 70), y: Math.floor(height / 70) - 1};
        this.unitSize = Math.floor(width / this.unit.x);

        const _grid = [];

        for (let i = 0; i < this.unit.x; i++) {
            for (let j = 0; j < this.unit.y; j++) {
                _grid.push({x: i, y: j});
            }
        }

        this.setState({
            padding: {
                x: Math.floor((width - (this.unitSize * this.unit.x)) / 2),
                y: Math.floor((height - (this.unitSize * this.unit.y)) / 2)
            },
            grid: _grid
        });
    }

    componentWillUnmount() {
        this.data.current = this.state.data;
    }

    canShiftBox(box, shift) {
        
    }

    render() {
        return (
            <View onLayout={(event) => {
                    var { width, height } = event.nativeEvent.layout;
                    this.calculate(width - 8, height - 8)
                }}
                style={{
                    height: '100%',
                    width: '100%',
                    paddingHorizontal: this.state.padding.x + 4,
                    paddingVertical: this.state.padding.y + 4,
                }}
            >
                <View
                    style={{
                        height: '100%',
                        width: '100%',
                        backgroundColor: '#ff000080',
                    }}
                >
                    {this.state.grid.map((data) => {
                            return <View
                                key={uid()}
                                style={{
                                    position: 'absolute',
                                    top: data.y * this.unitSize,
                                    left: data.x * this.unitSize,
                                    width: this.unitSize,
                                    height: this.unitSize,
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
                    {
                        this.state.widgets.map((widget, index) => {
                            return React.createElement(widget.type, {
                                unit: this.unit,
                                snap: this.unitSize,
                                padding: {
                                    x: this.state.padding.x + 4,
                                    y: this.state.padding.y + 4,
                                },
                                key: "widget_" + uid(),
                                edit: true,
                                initial: widget.initial,
                                boxRef: this.state.data[index],
                            }, null);
                        })
                    }
                </View>
            </View>
        );
    }
}
