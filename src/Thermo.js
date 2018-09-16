import React from 'react';
import thermoService from './thermoService.js'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import {setTempeDoneAction} from './actions'
import {Text, Slider, View, ActivityIndicator} from 'react-native';
import styles from './style.js'

const minTempe=50
const maxTempe=90

const loadingIcon = <ActivityIndicator size="small" color="#00ff00" />

class Thermo extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      showloading:false,
      sliderValue: this.props.temperature,
    };
  }

  
  shouldComponentUpdate(nextProps, nextState){
    let ret = nextProps.temperature!=this.props.temperature
          || nextState.showloading!=this.state.showloading
          || nextProps.seedId!=this.props.seedId
          || nextProps.name!=this.props.name
          || nextState.sliderValue!=this.state.sliderValue
    if (nextProps.temperature!=this.props.temperature) {
      nextState.sliderValue= nextProps.temperature   
    }
    return ret
  }


  onSliderChange = (sliderValue) => {
    this.setState({sliderValue});
  }

  onAfterChange = async (value) => {
    this.setState({showloading:true})
    try {
      await thermoService(this.props.accessToken, this.props.seedId, 
            value)
      this.props.setTempe({'seedId':this.props.seedId, temperature:value})
    }catch(e){
      this.setState({sliderValue: this.props.temperature})
    }
    this.setState({showloading:false})
  }

  render(){
    console.log(this.props.name+' thermo render '+this.state.sliderValue)
    return (

        <View style={styles.thermo}>
          <View style={{ flexDirection:'row'}}>
            <Text style={styles.normalText}>Thermostat {this.props.name}:
              <Text > {this.state.sliderValue} </Text>
            </Text>
            {this.state.showloading && loadingIcon}
          </View>
          <Slider value={this.state.sliderValue} 
                minimumValue={minTempe} maximumValue={maxTempe}
                step={1}
                style={{height:44}}
                minimumTrackTintColor="red"
                maximumTrackTintColor="blue"
                onValueChange={this.onSliderChange}
                onSlidingComplete={this.onAfterChange}
          />
        </View>
    );
  }
}

Thermo.propTypes = {
  seedId:PropTypes.string.isRequired,
};

const mapStateToProps = function(state, ownProps) {
  return {...state.loginReducer, 
      'temperature':
        state.thermoListReducer.thermos[ownProps.seedId].temperature,
      'name':
        state.thermoListReducer.thermos[ownProps.seedId].name,
    };
}

const mapDispatchToProps = function(dispatch) {
  return {
    setTempe: (seeds)=> {
      dispatch(setTempeDoneAction(seeds));
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Thermo);
