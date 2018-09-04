import React from 'react';
import PropTypes from 'prop-types'
import {loginAction} from './actions'
import loginService from './loginService.js'
import { connect } from 'react-redux'
import {Platform, StyleSheet, Text, View, Button, TextInput, SafeAreaView} from 'react-native';

const inputStyle={}//'marginLeft':'10px'}
const loginErrMsg = 'Login failed. Please try again.'

class Login extends React.Component {
    constructor(props) {
    super(props);
    this.state = {account:'', password:'', errMsg:'', loginClass:''};
  }

  passwordChange=(text)=>{
    this.setState({password: text})
  }

  accountChange=(text)=>{
    this.setState({account: text})
  }



  getAccessToken= async (account, password)=>{    
    this.setState({loginClass:'blinkClass'})
    let errMsg=''
    try {
      let respObj = await loginService(account, password) 
      this.setState({errMsg: '', loginClass:''})
      this.props.afterLogin(respObj.access_token, respObj.fullName)
    } catch(e) {
      console.log(new Error(e))
      errMsg = loginErrMsg
      // can't move this setState after catch.
      // It will report warning in console log since 
      // afterLogin() already unmount login component
      this.setState({errMsg , loginClass:''}) 
    }
  }
  
  handleSubmit = (e)=>{
    e.preventDefault()
    this.getAccessToken(this.state.account, this.state.password)
  }

  render() {
    return (
      <SafeAreaView>
        <Text>Please login</Text>
          <TextInput type='text' 
            value={this.state.account} 
            onChangeText={this.accountChange}
            autoCapitalize={false}
            placeholder='email address' style={inputStyle}/>
          <TextInput type='password'  
            value={this.state.password} 
            autoCapitalize={false}
            textContentType="password"
            secureTextEntry="true"
            onChangeText={this.passwordChange}
            placeholder='password' style={inputStyle}/>
          <Button 
            onPress={this.handleSubmit}
            type='submit' title='Login' style={inputStyle} 
            className={this.state.loginClass}/>
          <Text>{this.state.errMsg}</Text>
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

