/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import Login from './src/Login.js'
import ThermoList from './src/ThermoList.js'
import { connect } from 'react-redux'
import Symbol from 'es6-symbol/implement'

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

const mapStateToProps = function(state) {
  return {...state.loginReducer};
}

export default connect(
  mapStateToProps
)(App);

