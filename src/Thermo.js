import React from 'react';
import thermoService from './thermoService.js'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import {setTempeDoneAction} from './actions'
import {Text, Slider, SafeAreaView, View} from 'react-native';
import styles from './style.js'

const minTempe=50
const maxTempe=90

class Thermo extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      tempeClass:'',
      sliderValue: this.props.temperature,
    };
  }

  shouldComponentUpdate(nextProps, nextState){
    if (nextProps.temperature!=this.props.temperature) {
      nextState.sliderValue= nextProps.temperature   
      return true
    }
    return nextState.temperature!=this.state.temperature
        || nextState.tempeClass!=this.state.tempeClass
        || nextProps.seedId!=this.props.seedId
  }

  onSliderChange = (sliderValue) => {
    this.setState({sliderValue});
  }

  onAfterChange = async (value) => {
    this.setState({tempeClass: 'blinkClass'})
    try {
      await thermoService(this.props.accessToken, this.props.seedId, 
            value)
      this.props.setTempe({'seedId':this.props.seedId, temperature:value})
    }catch(e){
      this.setState({sliderValue: this.props.temperature})
    }
    this.setState({tempeClass: ''})
  }

  render(){
    console.log('thermo render '+this.props.temperature)
    return (
      <SafeAreaView >
        <View style={styles.thermo}>
          <Text style={styles.normalText}>Thermostat {this.props.name}:
            <Text > {this.state.sliderValue} </Text>
          </Text>
          <Slider value={this.state.sliderValue} 
                minimumValue={minTempe} maximumValue={maxTempe}
                step={1}
                minimumTrackTintColor="red"
                maximumTrackTintColor="blue"
                onValueChange={this.onSliderChange}
                onSlidingComplete={this.onAfterChange}
          />
        </View>
      </SafeAreaView>
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
