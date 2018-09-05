/** @format */
import "babel-polyfill"

import {AppRegistry} from 'react-native';
import React, {Component} from 'react';
import App from './App';
import {name as appName} from './app.json';


import rootReducer from './src/reducers'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { install } from 'redux-loop';

const store = createStore(rootReducer, {}, install())

const Root = () => (
    <Provider store={store}>
      <App/>
    </Provider>
  )

AppRegistry.registerComponent(appName, () => Root);
