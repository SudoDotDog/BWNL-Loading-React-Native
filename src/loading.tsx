/* eslint-disable @typescript-eslint/no-magic-numbers */
/**
 * @author WMXPY
 * @namespace Loading
 * @description Loading
 */

import * as React from 'react';
import { Animated, View, ViewStyle } from 'react-native';

export type LoadingProps = {

    readonly duration?: number;
    readonly loading?: boolean;
    readonly size?: number;
    readonly outerColor?: string;
    readonly innerColor?: string;
    readonly style?: ViewStyle;
};

export type LoadingStates = {

    readonly widthAnim: Animated.Value;
    readonly rotateAnim: Animated.Value;
    readonly innerAnim: Animated.Value;
};

export class Loading extends React.Component<LoadingProps, LoadingStates> {

    public readonly state: LoadingStates = {

        widthAnim: new Animated.Value(0),
        rotateAnim: new Animated.Value(0),
        innerAnim: new Animated.Value(0),
    };

    private _onGoing: boolean = false;

    public constructor(props: LoadingProps) {

        super(props);

        this._shrinkWidth = this._shrinkWidth.bind(this);
        this._expandWidth = this._expandWidth.bind(this);
        this._startRotate = this._startRotate.bind(this);
        this._innerRotate = this._innerRotate.bind(this);
    }

    public componentDidMount(): void {
        this._checkLoading();
    }

    public componentDidUpdate(): void {
        this._checkLoading();
    }

    public render() {

        const boxSize: number = this._getOuterSize();
        return (<View style={{
            ...this.props.style,
            height: boxSize,
            width: boxSize,
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            {this._renderSquare(this._getOuterColor(), this.state.rotateAnim)}
            {this._renderSquare(this._getInnerColor(), this.state.innerAnim)}
        </View>);
    }

    private _renderSquare(color: string, rotate: Animated.Value): React.ReactNode {

        const size: number = this._getSize();
        const position: number = this._getPosition();

        const width: Animated.Value = this.state.widthAnim;
        return (<Animated.View
            style={{
                height: size,
                width: size,
                borderWidth: width,
                borderColor: color,
                position: 'absolute',
                top: position,
                left: position,
                transform: [{
                    rotate: rotate.interpolate({
                        inputRange: [0, 360],
                        outputRange: ['0deg', '360deg'],
                    }),
                }],
            }}
        />);
    }

    private _checkLoading(): void {

        const loading: boolean = Boolean(this.props.loading);

        if (loading && !this._onGoing) {

            this._expandWidth();
            this._startRotate();
            this._innerRotate();
            this._onGoing = true;
        }

        if (!loading && this._onGoing) {

            this._shrinkWidth();
            this._onGoing = false;
        }
    }

    private _shrinkWidth(): void {

        Animated.timing(
            this.state.widthAnim,
            {
                toValue: 0,
                duration: this._getDuration(0.25),
                useNativeDriver: true,
            },
        ).start();
    }

    private _expandWidth(): void {

        Animated.timing(
            this.state.widthAnim,
            {
                toValue: this._getWidth(),
                duration: this._getDuration(0.4),
                useNativeDriver: true,
            },
        ).start();
    }

    private _startRotate(): void {

        this.state.rotateAnim.setValue(0);
        if (!this.props.loading) {
            return;
        }

        Animated.timing(
            this.state.rotateAnim,
            {
                toValue: 360,
                duration: this._getDuration(),
                useNativeDriver: true,
            },
        ).start(() => this._startRotate());
    }

    private _innerRotate(): void {

        this.state.innerAnim.setValue(0);
        if (!this.props.loading) {
            return;
        }

        Animated.timing(
            this.state.innerAnim,
            {
                toValue: 360,
                duration: this._getDuration(0.5),
                useNativeDriver: true,
            },
        ).start(() => this._innerRotate());
    }

    private _getInnerColor(): string {

        return this.props.innerColor || '#01FF70';
    }

    private _getOuterColor(): string {

        return this.props.outerColor || '#001F3F';
    }

    private _getDuration(delayTimes: number = 1): number {

        const duration: number = this.props.duration || 2500;
        return Math.ceil(duration * delayTimes);
    }

    private _getSize(): number {

        return this.props.size ? Math.floor(this.props.size) : 100;
    }

    private _getWidth(): number {

        return this.props.size ? Math.ceil(this.props.size / 10) : 10;
    }

    private _getPosition(): number {

        return Math.floor(this._getSize() / 4);
    }

    private _getOuterSize(): number {

        return Math.ceil(this._getSize() * 1.5);
    }
}
