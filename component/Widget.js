
import React, { Component } from "react";
import {
  StyleSheet,
  View,
  PanResponder,
  Animated
} from "react-native";

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

function shift(actual, delta, size, box, bounds) {
    const sub = {x: delta.x - actual.x, y: delta.y - actual.y};
    const area = Math.floor(size / 2);
    const shift = {x: 0, y: 0};

    if ((actual.x + box.x > 0) && (sub.x < -area)) {
        shift.x = -1;
    } else if ((actual.x + box.x + box.width < bounds.width) && (sub.x > area)) {
        shift.x = 1;
    }

    if ((actual.y + box.y > 0) && (sub.y < -area)) {
        shift.y = -1;
    } else if ((actual.y + box.y + box.height < bounds.height) && (sub.y > area)) {
        shift.y = 1;
    }

    return shift;
}

function resize(actual, delta, size, bounds) {
    const sub = {
        x: delta.x - actual.x,
        y: delta.y - actual.y,
        width: actual.width - delta.width,
        height: actual.height - delta.height
    }

    const snap = Math.floor(size / 2);
    const shift = {x: 0, y: 0, width: 0, height: 0};
    const factor = {
        x: Math.floor((sub.x + snap) / size),
        y: Math.floor((sub.y + snap) / size),
        width: Math.floor((sub.width + snap) / size),
        height: Math.floor((sub.height + snap) / size)
    }

    shift.x = -1 * factor.x;
    shift.y = -1 * factor.y;
    shift.width = 1 * factor.width;
    shift.height = 1 * factor.height;

    return shift;
}

export default class Widget extends Component {

    initBox() {
        return {
            default: this.constructor.getDefaultSize(),
            min: this.constructor.getMinimalSize()
        };
    }

    constructor(props) {
        super(props);

        this.box = this.initBox();
        this.snap = props.snap;
        this.const = {
            default: {
                width: this.snap * this.box.default.width,
                height: this.snap * this.box.default.height
            },
            min: {
                width: this.snap * this.box.min.width - 10,
                height: this.snap * this.box.min.height - 10
            },
        }

        if (props.initial) {
            this.initial = JSON.parse(JSON.stringify(props.initial));
            this.initial.x *= this.snap;
            this.initial.y *= this.snap;
            this.initial.width *= this.snap;
            this.initial.height *= this.snap;
        } else {
            this.initial = {
                x: 0,
                y: 0,
                width: this.const.default.width,
                height: this.const.default.height,
            }
        }

        this.state = {
            edit: props.edit ? props.edit : false,
            
            pan: new Animated.ValueXY({x: this.initial.x, y: this.initial.y}),
            
            width: this.initial.width,
            height: this.initial.height,

            widthAnim: new Animated.Value(this.initial.width),
            heightAnim: new Animated.Value(this.initial.height),
            
            previewPan: new Animated.ValueXY({x: this.initial.x, y: this.initial.y}),

            previewWidthAnim: new Animated.Value(this.initial.width),
            previewHeightAnim: new Animated.Value(this.initial.height),

            status: 0
        }

        this._backend = {
            main: {
                x: this.initial.x,
                y: this.initial.y
            },
            preview: {
                x: this.initial.x,
                y: this.initial.y,
                width: this.initial.width,
                height: this.initial.height
            }
        };

        this.preview = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        }

        this.static = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        }

        this.resize = {
            x: 0,
            y: 0,
        }

        this.click = {x: 0, y: 0};
        this.edge = 25;

        this.state.pan.addListener((value) => {
            this._backend.main.x = value.x;
            this._backend.main.y = value.y;
        });
        this.state.widthAnim.addListener((value) => this.setState({width: value.value}));
        this.state.heightAnim.addListener((value) => this.setState({height: value.value}));

        this.state.previewPan.addListener((value) => {
            this._backend.preview.x = value.x;
            this._backend.preview.y = value.y;
        });
        this.state.previewWidthAnim.addListener((value) => this._backend.preview.width = value.value);
        this.state.previewHeightAnim.addListener((value) => this._backend.preview.height = value.value);

        this.panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: () => this.state.edit,
            onPanResponderGrant: (e, gesture) => {
                this.click = {
                    x: gesture.x0 - this._backend.main.x - props.padding.x,
                    y: gesture.y0 - this._backend.main.y - props.padding.y
                };
                this.preview = {
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0
                }
                this.static = {...this._backend.preview}

                if (this.click.x <= this.edge) {
                    // left
                    this.resize.x = -1;
                } else if (this.click.x >= this.state.width - this.edge) {
                    // right
                    this.resize.x = 1;
                }
                if (this.click.y <= this.edge) {
                    // top
                    this.resize.y = -1;
                } else if (this.click.y >= this.state.height - this.edge) {
                    // bottom
                    this.resize.y = 1;
                }

                this.state.pan.setOffset(this._backend.main);
                this.state.previewPan.setOffset(this._backend.preview);
                this.state.widthAnim.setOffset(this.state.width);
                this.state.heightAnim.setOffset(this.state.height);
                this.state.previewWidthAnim.setOffset(this._backend.preview.width);
                this.state.previewHeightAnim.setOffset(this._backend.preview.height);
                
                this.state.previewPan.setValue({x: 0, y: 0});
                this.state.pan.setValue({x: 0, y: 0});
                this.state.widthAnim.setValue(0);
                this.state.heightAnim.setValue(0);
                this.state.previewWidthAnim.setValue(0);
                this.state.previewHeightAnim.setValue(0);
            },
            onPanResponderMove: (e, gesture) => {
                action = Animated.event([null, {dx: this.state.pan.x, dy: this.state.pan.y}], {useNativeDriver:false});

                if (this.resize.x != 0 || this.resize.y != 0) {
                    action = (e, gesture) => {
                        prop = {};
                        if ((gesture.dx * this.resize.x + this.static.width) > this.const.min.width) {
                            if ((this.resize.x == -1)) {
                                prop.dx = this.state.pan.x;
                            }
                            this.state.widthAnim.setValue(gesture.dx * this.resize.x);
                        }
                        if ((gesture.dy * this.resize.y + this.static.height) > this.const.min.height) {
                            if ((this.resize.y == -1)) {
                                prop.dy = this.state.pan.y;
                            }
                            this.state.heightAnim.setValue(gesture.dy * this.resize.y);
                        }
                        Animated.event([null, prop], {useNativeDriver:false})(e, gesture);

                        let shifted = resize(
                            {
                                x: this._backend.main.x,
                                y: this._backend.main.y,
                                width: this.state.width,
                                height: this.state.height,
                            },
                            this.static,
                            this.snap,
                            {
                                width: props.unit.x * this.snap,
                                height: props.unit.y * this.snap
                            }
                        );

                        this.preview.x = shifted.x * this.snap;
                        this.preview.y = shifted.y * this.snap;
                        this.preview.width = shifted.width * this.snap;
                        this.preview.height = shifted.height * this.snap;

                        Animated.spring(
                            this.state.previewPan,
                            {
                                toValue: this.preview,
                                speed: 16,
                                useNativeDriver: false,
                            }
                        ).start();

                        Animated.spring(
                            this.state.previewWidthAnim,
                            {
                                toValue: this.preview.width,
                                speed: 16,
                                useNativeDriver: false,
                            }
                        ).start();

                        Animated.spring(
                            this.state.previewHeightAnim,
                            {
                                toValue: this.preview.height,
                                speed: 16,
                                useNativeDriver: false,
                            }
                        ).start();
                    }
                } else {

                    let shifted = shift(
                        this.preview,
                        {x: gesture.dx,y: gesture.dy},
                        this.snap,
                        this.static,
                        {
                            width: props.unit.x * this.snap,
                            height: props.unit.y * this.snap
                        }
                    );

                    this.preview.x += shifted.x * this.snap;
                    this.preview.y += shifted.y * this.snap;

                    Animated.spring(
                        this.state.previewPan,
                        {
                            toValue: this.preview,
                            speed: 16,
                            useNativeDriver: false,
                        }
                    ).start();
                }

                action(e, gesture); 
            },
            onPanResponderRelease: () => {
                Animated.spring(
                    this.state.pan,
                    {
                        toValue: this.preview,
                        speed: 16,
                        useNativeDriver: false,
                    }
                ).start(() => {
                    props.boxRef.x = this._backend.main.x / this.snap;
                    props.boxRef.y = this._backend.main.y / this.snap;
                });

                Animated.spring(
                    this.state.widthAnim,
                    {
                        toValue: this.preview.width,
                        speed: 16,
                        useNativeDriver: false,
                    }
                ).start(() => {
                    props.boxRef.width = this.state.width / this.snap;
                });

                Animated.spring(
                    this.state.heightAnim,
                    {
                        toValue: this.preview.height,
                        speed: 16,
                        useNativeDriver: false,
                    }
                ).start(() => {
                    props.boxRef.height = this.state.height / this.snap;
                });

                this.resize = {
                    x: 0,
                    y: 0,
                }

                this.setState({status: 0});
            }
        });
    }

    static getDerivedStateFromProps(props, state) {
        state.edit = props.edit;
        return state;
    }

    static getDefaultSize() {
        return this.getMinimalSize();
    }

    static getMinimalSize() {
        return {
            width: 1,
            height: 1
        }
    }

    render() {
        active = {
            left: null,
            top: null,
            right: null,
            bottom: null,
        };

        if (this.state.edit) {
            if (this.resize.x == -1) {
                active.left = 'center';
            } else if (this.resize.x == 1) {
                active.right = 'center';
            }
            if (this.resize.y == -1) {
                active.top = active.left ? 'begin' : active.right ? 'end' : 'center';
                if (active.top == 'begin') {
                    active.left = 'begin';
                } else if (active.top == 'end') {
                    active.right = 'begin';
                }
            } else if (this.resize.y == 1) {
                active.bottom = active.right ? 'end' : active.left ? 'begin' : 'center';
                if (active.bottom == 'end') {
                    active.right = 'end';
                } else if (active.bottom == 'begin') {
                    active.left = 'end';
                }
            }
        }

        return (
            <>
                <Animated.View
                    style={{
                        position: 'absolute',
                        ...this.state.previewPan.getLayout()
                    }}
                    {...this.panResponder.panHandlers}
                >
                    <View
                        style={{
                            width: this._backend.preview.width,
                            height: this._backend.preview.height,
                            padding: 15,
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: '#d9d9d980',
                                width: '100%',
                                height: '100%',
                                borderRadius: 10,
                            }}
                        />
                    </View>
                </Animated.View>
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
                        >
                            {this.state.edit && <>
                                <Side baseColor='#84b0d1' activeColor='#d184b0' active={active.left} size={this.state.height + 10} pos={-2} />
                                <Side baseColor='#84b0d1' activeColor='#d184b0' active={active.top} size={this.state.width + 10} pos={-2} direction='row' />
                                <Side baseColor='#84b0d1' activeColor='#d184b0' active={active.right} size={this.state.height + 10} pos={this.state.width - 12} />
                                <Side baseColor='#84b0d1' activeColor='#d184b0' active={active.bottom} size={this.state.width + 10} pos={this.state.height - 12} direction='row' />
                            </>}
                        </View>
                    </View>
                </Animated.View>
            </>
        );
    }
}
