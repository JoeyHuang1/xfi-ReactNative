/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, LayoutAnimation, NativeModules, AsyncStorage} from 'react-native';
import Login from './src/Login.js'
import ThermoList from './src/ThermoList.js'
import { connect } from 'react-redux'
import ComcastConst from './src/ComcastConst.js'
import {loginAction} from './src/actions'

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
class App extends React.PureComponent<Props> {
  componentDidMount() {
    this.readtSavedOpt()
  }

  readtSavedOpt=async ()=>{
    try {
      let values = await AsyncStorage.multiGet([ ComcastConst.keepLogin, ComcastConst.loginAccessToken, ComcastConst.rememberName])
      if (JSON.parse(values[0][1])){
        this.props.dispatch(loginAction({'accessToken':values[1][1], 'account':values[2][1]}));    
      }  
    } catch (e) {
      console.log(e)
    }
  }

  render() {
    if (this.props.accessToken==null){
      return (<Login/>)
    }
    else {
      return(
        <ThermoList/>
      )
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
var CustomLayoutLinear2 = {
  duration: 300,
  create: {
    type: LayoutAnimation.Types.linear,
    property: LayoutAnimation.Properties.scaleY,
  },
  update: {
    type: LayoutAnimation.Types.linear,
  },
};

const mapStateToProps = function(state) {
  LayoutAnimation.configureNext(CustomLayoutLinear2);
  return {...state.loginReducer};
}

export default connect(
  mapStateToProps
)(App);
