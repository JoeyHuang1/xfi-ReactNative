import React from 'react';
import PropTypes from 'prop-types'
import {loginAction} from './actions'
import loginService from './loginService.js'
import { connect } from 'react-redux'
import ComcastConst from './ComcastConst.js'
import {Text,  Button, TextInput, SafeAreaView, ActivityIndicator, KeyboardAvoidingView, Switch, AsyncStorage, View} from 'react-native';
import styles from './style.js'

const loginErrMsg = <Text >Login failed. Please try again.</Text>
const loadingIcon = <ActivityIndicator size="small" color="#00ff00" />


class Login extends React.PureComponent {
    constructor(props) {
    super(props);
  
    this.state = {account:'', password:'', errMsg:null, 
      initPwdFocus:false, optLoaded:false, 
      showLoading:false, keepLogin:false, remember:false, rememberId:''};
    this.readSavedOpt()
  }


  readSavedOpt=async ()=>{
    try {
      let keepLoginPromise =  AsyncStorage.getItem(ComcastConst.keepLogin)

      let valuesPromise =  AsyncStorage.multiGet([ComcastConst.remember, ComcastConst.rememberId])

      await Promise.all([keepLoginPromise, valuesPromise])
      let keepLogin = await keepLoginPromise
      let values = await valuesPromise

      if (!this.mounted)
        return
      this.setState({'keepLogin':JSON.parse(keepLogin)})
      let rem = JSON.parse(values[0][1])
      if (rem ) {
        this.state.remember = rem
        if (values[1][1] && values[1][1].length>0) {
          this.setState({account:values[1][1],
            initPwdFocus:true})
        }
      }
    }catch(e){
      console.log('readSavedOpt exception '+e)
    }

    this.setState({optLoaded:true})
  }


  componentDidMount() {
    this.mounted = true
  }

  componentWillUnmount() {
    this.mounted = false
  }

  passwordChange=(text)=>{
    this.setState({password: text})
  }

  accountChange=(text)=>{
    this.setState({account: text})
  }

  saveAccount=(event)=>{
    if (this.state.remember ) {
      if (this.state.account)
        AsyncStorage.setItem(ComcastConst.rememberId, 
          this.state.account).catch()
      else
        AsyncStorage.removeItem(ComcastConst.rememberId).catch()
  }
  }

  keepLoginChange=(val)=>{
    this.setState({keepLogin: val})
    AsyncStorage.setItem(ComcastConst.keepLogin, JSON.stringify(val))
    if (!val)
      AsyncStorage.removeItem(ComcastConst.loginAccessToken).catch()
  }

  rememberChange=(val)=>{
    this.setState({remember: val})
    AsyncStorage.setItem(ComcastConst.remember, JSON.stringify(val)).catch()
    if (!val)
      AsyncStorage.removeItem(ComcastConst.rememberId).catch()
  }

  getAccessToken= async (account, password)=>{    
    let errMsg=null
    this.saveAccount()
    this.setState({ showloading:true, errMsg})
    try {
      let respObj = await loginService(account, password) 
      this.setState({errMsg: null,  showloading:false})
      if (this.state.keepLogin)
        AsyncStorage.multiSet([[ComcastConst.loginAccessToken, respObj.access_token],  [ComcastConst.rememberName, respObj.fullName]]).catch()
      this.props.afterLogin(respObj.access_token, respObj.fullName)
    } catch(e) {
      console.log(new Error(e))
      errMsg = loginErrMsg
      // can't move this setState after catch.
      // It will report warning in console log since 
      // afterLogin() already unmount login component
      this.setState({errMsg ,  showloading:false}) 
    }
  }
  
  handleSubmit = (e)=>{
    this.getAccessToken(this.state.account, this.state.password)
  }

  render() {

    return (
      <SafeAreaView>
        <KeyboardAvoidingView keyboardVerticalOffset={10}
        >

          <Text style={styles.welcome}>Please login:</Text>
          {this.state.optLoaded && 
            <View>
              <TextInput 
                style={styles.input}
                value={this.state.account}
                onChangeText={this.accountChange}
                onEndEditing={this.saveAccount}
                autoFocus={!this.state.initPwdFocus}
                autoCapitalize={"none"}
                placeholder="email address" />          
              <TextInput  
                style={styles.input}
                value={this.props.password} 
                autoFocus={this.state.initPwdFocus}
                autoCapitalize={"none"}
                textContentType="password"
                returnKeyType="go"
                secureTextEntry={true}
                onChangeText={this.passwordChange}
                onSubmitEditing={this.handleSubmit}
                placeholder="password" />
            </View>
          }

          <Button 
            onPress={this.handleSubmit}
            title="Login"
          />

          <View style={styles.loginSaveOpt}>
            <Text> Remember me: </Text>     
            <Switch value={this.state.remember}
              style={styles.loginSwitch}
              onValueChange={this.rememberChange}
            ></Switch>
          </View>
          <View style={styles.loginSaveOpt}>
            <Text > Keep login: </Text>
            <Switch value={this.state.keepLogin}
              style={styles.loginSwitch}
              onValueChange={this.keepLoginChange}
            ></Switch>
          </View>
          {this.state.showloading && loadingIcon}
          {this.state.errMsg}
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }
}

Login.propTypes = {
  afterLogin: PropTypes.func.isRequired
};

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    afterLogin: (accessToken, account)=> {
      dispatch(loginAction({accessToken, account}));
    }
  }
}

export default connect(
  null,
  mapDispatchToProps
)(Login);

