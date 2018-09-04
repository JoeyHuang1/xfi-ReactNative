/** @format */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import rootReducer from './src/reducers'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { install } from 'redux-loop';
import React, {Component} from 'react';

const store = createStore(rootReducer, {}, install())

const Root = () => (
    <Provider store={store}>
      <App />
    </Provider>
  )

AppRegistry.registerComponent(appName, () => Root);
