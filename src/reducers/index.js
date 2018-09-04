//import { combineReducers } from 'redux'
import loginReducer from './loginReducer'
import thermoListReducer from './thermoListReducer'
import { combineReducers } from 'redux-loop';

export default combineReducers({
  loginReducer,
  thermoListReducer
})