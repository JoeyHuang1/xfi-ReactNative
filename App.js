/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, LayoutAnimation, NativeModules} from 'react-native';
import Login from './src/Login.js'
import ThermoList from './src/ThermoList.js'
import { connect } from 'react-redux'

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
class App extends Component<Props> {
  render() {
    if (this.props.accessToken==null){
      return (<Login/>)
    }
    else {
      return(<ThermoList/>)
    }
  }
}

// Spring 
var CustomLayoutSpring = {
  duration: 900,
  create: {
    type: LayoutAnimation.Types.spring,
    property: LayoutAnimation.Properties.scaleXY,
    springDamping: 0.7,
  },
  update: {
    type: LayoutAnimation.Types.spring,
    springDamping: 0.7,
  },
};

// Linear with easing
var CustomLayoutLinear = {
  duration: 600,
  create: {
    type: LayoutAnimation.Types.linear,
    property: LayoutAnimation.Properties.opacity,
  },
  update: {
    type: LayoutAnimation.Types.curveEaseInEaseOut,
  },
};

const mapStateToProps = function(state) {
  LayoutAnimation.configureNext(CustomLayoutSpring);
  return {...state.loginReducer};
}

export default connect(
  mapStateToProps
)(App);
