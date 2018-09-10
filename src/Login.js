import React from 'react';
import PropTypes from 'prop-types'
import {loginAction} from './actions'
import loginService from './loginService.js'
import { connect } from 'react-redux'
import {Text,  Button, TextInput, SafeAreaView, ActivityIndicator} from 'react-native';
import styles from './style.js'

const loginErrMsg = <Text>Login failed. Please try again.</Text>
const loadingIcon = <ActivityIndicator size="small" color="#00ff00" />

class Login extends React.PureComponent {
    constructor(props) {
    super(props);
    this.state = {account:'', password:'', errMsg:null, loginClass:'',
      showLoading:null};
  }

  passwordChange=(text)=>{
    this.setState({password: text})
  }

  accountChange=(text)=>{
    this.setState({account: text})
  }

  getAccessToken= async (account, password)=>{    
    let errMsg=null
    this.setState({loginClass:'blinkClass', showloading:loadingIcon, errMsg})
    try {
      let respObj = await loginService(account, password) 
      this.setState({errMsg: null, loginClass:'', showloading:null})
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
    e.preventDefault()
    this.getAccessToken(this.state.account, this.state.password)
  }

  render() {
    return (
      <SafeAreaView>
        <Text style={styles.welcome}>Please login:</Text>
        <TextInput 
          style={styles.input}
          value={this.state.account} 
          onChangeText={this.accountChange}
          autoCapitalize={"none"}
          placeholder="email address" />
        <TextInput  
          style={styles.input}
          value={this.state.password} 
          autoCapitalize={"none"}
          textContentType="password"
          secureTextEntry={true}
          onChangeText={this.passwordChange}
          placeholder="password" />
        <Button 
          onPress={this.handleSubmit}
          title="Login"
        />
        {this.state.showloading}
        {this.state.errMsg}
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

