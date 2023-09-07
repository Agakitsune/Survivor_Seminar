
import React, { Component } from "react";
import {
  StyleSheet,
  View,
  PanResponder,
  Animated
} from "react-native";
import { act } from "react-test-renderer";

function Side(props) {
    let { direction, active } = props;
    const { size, pos } = props;
    const { baseColor, activeColor} = props;

    if (direction != 'row' && direction != 'column') {
        direction = 'column';
    }
    if (active != 'begin' && active != 'center' && active != 'end') {
        active = null;
    }

    let width = direction == 'row' ? 24 : 4;
    let height = direction == 'row' ? 4 : 24;
    let top = direction == 'row' ? pos : null;
    let left = direction == 'row' ? null : pos;

    return (
        <>
            <View
                style={{
                    position: 'absolute',
                    backgroundColor: active == 'begin' ? activeColor : baseColor,
                    width: width,
                    height: height,
                    top: top ? top : -2,
                    left: left ? left : -2,
                    borderRadius: 10,
                }}
            />
            <View
                style={{
                    position: 'absolute',
                    backgroundColor: active == 'center' ? activeColor : baseColor,
                    width: width,
                    height: height,
                    top: top ? top : size / 2 - 22,
                    left: left ? left : size / 2 - 22,
                    borderRadius: 10,
                }}
            />
            <View
                style={{
                    position: 'absolute',
                    backgroundColor: active == 'end' ? activeColor : baseColor,
                    width: width,
                    height: height,
                    top: top ? top : size - 42,
                    left: left ? left : size - 42,
                    borderRadius: 10,
                }}
            />
        </>
    )
}

export default class Drag extends Component {

    constructor(props) {
        super(props);

        this.state = {
            position: {x: 0, y: 0},
            width: 150,
            height: 150,
            pan: new Animated.ValueXY({x: 0, y: 0}),
            widthAnim: new Animated.Value(150),
            heightAnim: new Animated.Value(150),
            anchorX: 0,
            anchorY: 0
        }

        this.click = {x: 0, y: 0};
        this.border = 100;

        this.state.widthAnim.addListener((value) => this.setState({width: value.value}));
        this.state.heightAnim.addListener((value) => this.setState({height: value.value}));
        this.state.pan.addListener((value) => this.setState({position: value}));

        this.panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (e, gesture) => {
                this.click = {x: gesture.x0 - this.state.position.x, y: gesture.y0 - this.state.position.y};
                mid = this.border / 2;

                if ((this.click.x + mid) <= this.border) {
                    // left
                    this.setState({anchorX: -1});
                } else if ((this.click.x - mid) >= this.state.width - this.border) {
                    // right
                    this.setState({anchorX: 1});
                }

                if ((this.click.y + mid) <= this.border) {
                    // top
                    this.setState({anchorY: -1});
                } else if ((this.click.y - mid) >= this.state.height - this.border) {
                    // bottom
                    this.setState({anchorY: 1});
                }

                this.state.widthAnim.extractOffset();
                this.state.heightAnim.extractOffset();
            },
            onPanResponderMove: (e, gesture) => {
                action = Animated.event([null, {dx: this.state.pan.x, dy: this.state.pan.y}], {useNativeDriver:false});
                if (this.state.anchorX != 0 || this.state.anchorY != 0) {
                    action = (e, gesture) => {
                        prop = {};
                        if (this.state.anchorX == -1) {
                            prop.dx = this.state.pan.x;
                        }
                        if (this.state.anchorY == -1) {
                            prop.dy = this.state.pan.y;
                        }
                        Animated.event([null, prop], {useNativeDriver:false})(e, gesture);

                        this.state.widthAnim.setValue(gesture.dx * this.state.anchorX);
                        this.state.heightAnim.setValue(gesture.dy * this.state.anchorY);
                    }
                }

                action(e, gesture); 
            },
            onPanResponderRelease: () => {
                this.state.pan.extractOffset();

                this.setState({anchorY: 0, anchorX: 0});
            }
        });
    }

    render() {
        active = {
            left: null,
            top: null,
            right: null,
            bottom: null,
        };

        if (this.state.anchorX == -1) {
            active.left = 'center';
        } else if (this.state.anchorX == 1) {
            active.right = 'center';
        }
        if (this.state.anchorY == -1) {
            active.top = active.left ? 'begin' : active.right ? 'end' : 'center';
            if (active.top == 'begin') {
                active.left = 'begin';
            } else if (active.top == 'end') {
                active.right = 'begin';
            }
        } else if (this.state.anchorY == 1) {
            active.bottom = active.right ? 'end' : active.left ? 'begin' : 'center';
            if (active.bottom == 'end') {
                active.right = 'end';
            } else if (active.bottom == 'begin') {
                active.left = 'end';
            }
        }

        return (
            <Animated.View
                style={{
                    position: 'absolute',
                    top: this.state.position.y,
                    left: this.state.position.x,
                }}
                {...this.panResponder.panHandlers}
            >
                <View
                    style={{
                        // backgroundColor: '#b784a740','
                        width: this.state.width,
                        height: this.state.height,
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
                        <Side baseColor='#84b0d1' activeColor='#d184b0' active={active.left} size={this.state.height} pos={-2} />
                        <Side baseColor='#84b0d1' activeColor='#d184b0' active={active.top} size={this.state.width} pos={-2} direction='row' />
                        <Side baseColor='#84b0d1' activeColor='#d184b0' active={active.right} size={this.state.height} pos={this.state.width - 22} />
                        <Side baseColor='#84b0d1' activeColor='#d184b0' active={active.bottom} size={this.state.width} pos={this.state.height - 22} direction='row' />
                    </View>
                </View>
            </Animated.View>
        );
    }
}
