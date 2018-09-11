import React from 'react';
import PropTypes from 'prop-types'
import {loginAction} from './actions'
import loginService from './loginService.js'
import { connect } from 'react-redux'
import ComcastConst from './ComcastConst.js'
import {Text,  Button, TextInput, SafeAreaView, ActivityIndicator, KeyboardAvoidingView, Switch, AsyncStorage, View} from 'react-native';
import styles from './style.js'

const loginErrMsg = <Text style={{top:10}}>Login failed. Please try again.</Text>
const loadingIcon = <ActivityIndicator size="small" color="#00ff00" 
          style={{top:10}}/>

class Login extends React.PureComponent {
    constructor(props) {
    super(props);
    this.state = {account:'', password:'', errMsg:null, loginClass:'',
      showLoading:null, keepLogin:false, remember:false, rememberId:''};

    AsyncStorage.getItem(ComcastConst.keepLogin)
      .then(( keepLogin)=>{
        if (keepLogin) {
          this.setState({'keepLogin':JSON.parse(keepLogin)})
        }
      }).catch((e)=>{
        console.log(e)
      })
    AsyncStorage.multiGet([ComcastConst.remember, ComcastConst.rememberId])
      .then((values)=>{
        let rem = JSON.parse(values[0][1])

        if (rem) {
          this.setState({'remember':rem,'account':values[1][1]})
        }
      }).catch((e)=>{
        console.log(e)
      })
  }

  passwordChange=(text)=>{
    this.setState({password: text})
  }

  accountChange=(text)=>{
    this.setState({account: text})
  }

  saveAccount=(event)=>{
    if (this.state.remember) {
      AsyncStorage.setItem(ComcastConst.rememberId, this.state.account).catch()
    }
  }

  keepLoginChange=(val)=>{
    this.setState({keepLogin: val})
    AsyncStorage.setItem(ComcastConst.keepLogin, JSON.stringify(val))
    if (!val)
      AsyncStorage.removeItem(ComcastConst.loginAccessToken).catch()
  }

  rememberChange=(val)=>{
    console.log('rem change '+val)
    this.setState({remember: val})
    AsyncStorage.setItem(ComcastConst.remember, JSON.stringify(val)).catch()
    if (!val)
      AsyncStorage.removeItem(ComcastConst.rememberId).catch()
    console.log('done rem change '+val)
  }

  getAccessToken= async (account, password)=>{    
    let errMsg=null
    this.saveAccount()
    this.setState({loginClass:'blinkClass', showloading:loadingIcon, errMsg})
    try {
      let respObj = await loginService(account, password) 
      this.setState({errMsg: null, loginClass:'', showloading:null})
      if (this.state.keepLogin)
        AsyncStorage.multiSet([[ComcastConst.loginAccessToken, respObj.access_token],  [ComcastConst.rememberName, respObj.fullName]]).catch()
      this.props.afterLogin(respObj.access_token, respObj.fullName)
    } catch(e) {
      console.log(new Error(e))
      errMsg = loginErrMsg
      // can't move this setState after catch.
      // It will report warning in console log since 
      // afterLogin() already unmount login component
      this.setState({errMsg , loginClass:'', showloading:null}) 
    }
  }
  
  handleSubmit = (e)=>{
    this.getAccessToken(this.state.account, this.state.password)
  }

  render() {
    return (
      <SafeAreaView>
        <KeyboardAvoidingView keyboardVerticalOffset={10}>
          <Text style={styles.welcome}>Please login:</Text>
          <TextInput 
            style={styles.input}
            value={this.state.account} 
            onChangeText={this.accountChange}
            onEndEditing={this.saveAccount}
            autoCapitalize={"none"}
            placeholder="email address" />
          <TextInput  
            style={styles.input}
            value={this.state.password} 
            autoCapitalize={"none"}
            textContentType="password"
            returnKeyType="go"
            secureTextEntry={true}
            onChangeText={this.passwordChange}
            onSubmitEditing={this.handleSubmit}
            placeholder="password" />
          <Button 
            onPress={this.handleSubmit}
            title="Login"
          />
          <View style={{ flexDirection:'row', alignItems:'center'}}>
            <Text>Remember email: </Text>     
            <Switch value={this.state.remember}
              onValueChange={this.rememberChange}
            ></Switch>
          </View>
          <View style={{ flexDirection:'row', alignItems:'center'}}>
            <Text >Keep login: </Text>
            <Switch value={this.state.keepLogin}
              onValueChange={this.keepLoginChange}
            ></Switch>
          </View>
          {this.state.showloading}
          {this.state.errMsg}
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
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

