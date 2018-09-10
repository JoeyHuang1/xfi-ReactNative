import React from 'react';
import Thermo from './Thermo.js'
import PropTypes from 'prop-types';
import thermoListService from './thermoListService.js'
import {gotSeedsAction} from './actions'
import { connect } from 'react-redux'
import {Text, View, SafeAreaView} from 'react-native';
import styles from './style.js'

const noDevErrMsg='No thermostat found.'
const noHCDevErrMsg = 'No heat/cool thermostat found.'

function renderThermo(thermos){
  let thermoList=[]
  for (let key in thermos){
    let thermo = thermos[key]
    thermoList.push(<Thermo style={{flex:1}} key={thermo.seedId}
      seedId={thermo.seedId}/>)
  }
  return thermoList
}

class ThermoList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { errMsg:'', accountClass:'', thermoList:[]};
    this.getThermoList = this.getThermoList.bind(this)
  }

  componentDidMount() {
    console.log('thermolist componentDidMount')
    this.getThermoList()
  }

  async getThermoList(){
    this.setState({accountClass:'blinkClass'})
    let thermoList=[]
    try {
      thermoList = await thermoListService(this.props.accessToken) 

      if (thermoList!=={}) 
        this.setState({ errMsg:'', accountClass:''})
      else 
        this.setState({errMsg: noHCDevErrMsg, accountClass:''})
    } catch(e) {
      console.log(new Error(e))
      this.setState({ errMsg: noDevErrMsg, accountClass:''})
    }
    this.props.gotThermos(thermoList)
  }
  


  render() {
    console.log('thermolist render')
    return (
      <SafeAreaView>
        <Text>{this.state.errMsg}</Text>
        <Text style={styles.welcome}>Account 
          <Text> {this.props.account} </Text>
        </Text> 
        <View style={{ height:600, 
          justifyContent:"space-evenly"}}>
          {this.props.thermoList}
        </View>
      </SafeAreaView>
    );
  }
}

ThermoList.propTypes = {
  account: PropTypes.string.isRequired,
  gotThermos:PropTypes.func.isRequired
};

const mapStateToProps = function(state) {
  let thermoList=renderThermo(state.thermoListReducer.thermos)

  return {...state.loginReducer, ...state.thermoListReducer, 
      'thermoList':thermoList};
}

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    gotThermos: (seeds)=> {dispatch(gotSeedsAction(seeds))},
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ThermoList);
