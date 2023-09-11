
import React, { Component } from "react";
import {
  StyleSheet,
  View,
  PanResponder,
  Animated
} from "react-native";
import { act } from "react-test-renderer";

function shift(actual, delta, size) {
    const sub = {x: delta.x - actual.x, y: delta.y - actual.y};
    const area = Math.floor(size / 2);
    const shift = {x: 0, y: 0};

    // console.log("Actual: " + JSON.stringify(actual));
    // console.log("Delta: " + JSON.stringify(delta));
    // console.log("Sub: " + JSON.stringify(sub));
    // console.log("Size: " + JSON.stringify(size));
    // console.log("Area: " + JSON.stringify(area));

    if (sub.x < -area) {
        shift.x = -1;
    } else if (sub.x > area) {
        shift.x = 1;
    }

    if (sub.y < -area) {
        shift.y = -1;
    } else if (sub.y > area) {
        shift.y = 1;
    }

    return shift;
}

export default class Test extends Component {

    constructor(props) {
        super(props);

        this.state = {
            position: {x: 0, y: 0},
            pan: new Animated.ValueXY({x: 0, y: 0}),

            previewPosition: {x: 0, y: 0},
            previewPan: new Animated.ValueXY({x: 0, y: 0}),

            width: props.size.current * 2,
            height: props.size.current * 2,
        };

        this._backPos = {x: 0, y: 0};
        this._back = {x: 0, y: 0};
        this.previewGhost = {x: 0, y: 0};

        this.state.pan.addListener((value) => this._backPos = value);
        this.state.previewPan.addListener((value) => this._back = value);

        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: (e, gesture) => {
                this.previewGhost = {
                    x: 0,
                    y: 0,
                };

                console.log("Grant: " + JSON.stringify(this.state.previewPosition));

                this.state.previewPan.setOffset(this._back);
                this.state.previewPan.setValue({x: 0, y: 0});

                this.state.pan.setOffset(this._backPos);
                this.state.pan.setValue({x: 0, y: 0});
            },
            onPanResponderMove: (e, gesture) => {
                action = Animated.event([null, {dx: this.state.pan.x, dy: this.state.pan.y}], {useNativeDriver:false});
                // console.log("Preview: " + JSON.stringify(this.previewGhost));

                let shifted = shift(
                    this.previewGhost,
                    {x: gesture.dx,y: gesture.dy},
                    props.size.current
                );

                // console.log("Shifted: " + JSON.stringify(shifted));

                this.previewGhost.x += shifted.x * props.size.current;
                this.previewGhost.y += shifted.y * props.size.current;

                // console.log("Preview after: " + JSON.stringify(this.previewGhost));
                // console.log("Actual: " + JSON.stringify(this.state.previewPosition));

                Animated.spring(
                    this.state.previewPan,
                    {
                        toValue: this.previewGhost,
                        speed: 5,
                        useNativeDriver: false,
                    }
                ).start();
                // this.state.previewPan.setValue(this.previewGhost);
                action(e, gesture);
            },
            onPanResponderRelease: (e, gesture) => {
                // this.state.pan.extractOffset();

                Animated.spring(
                    this.state.pan,
                    {
                        toValue: this.previewGhost,
                        friction: 12,
                        useNativeDriver: false,
                    }
                ).start();
                // console.log("Release: " + JSON.stringify(this.state.previewPosition));
                // console.log("Release Ghost: " + JSON.stringify(this.previewGhost));
            }
        });
    }

    render() {
        return(
            <>
            <Animated.View
                    style={{
                        position: 'absolute',
                        ...this.state.pan.getLayout()
                    }}
                    {...this.panResponder.panHandlers}
                >
                    <View
                        style={{
                            // backgroundColor: '#b784a740','
                            width: this.state.width,
                            height: this.state.height,
                            padding: 5,
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: '#d9d9d9',

                                width: '100%',
                                height: '100%',
                                borderRadius: 10,
                            }}
                        />
                    </View>
                </Animated.View>
                <Animated.View
                    style={{
                        width: this.state.width,
                        height: this.state.height,
                        padding: 15,
                        position: 'absolute',
                        ...this.state.previewPan.getLayout(),
                    }}
                    {...this.panResponder.panHandlers}
                >
                    <View
                        style={{
                            backgroundColor: '#d9d9d980',
                            width: '100%',
                            height: '100%',
                            borderRadius: 10,
                        }}
                    />
                </Animated.View>
            </>
        );
    }
}
