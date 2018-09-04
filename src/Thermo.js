import React from 'react';
import thermoService from './thermoService.js'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import {setTempeDoneAction} from './actions'
import {Platform, StyleSheet, Text, View, Slider, SafeAreaView} from 'react-native';

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
    return (
      <SafeAreaView className='thermoContainer'>
        <View className='thermoTitle' >
          <Text>Thermostat {this.props.name}:</Text>
          <Text className={this.state.tempeClass}> {this.state.sliderValue} </Text>
        </View>
        <Slider className='thermoSlider' value={this.state.sliderValue} 
              minimumValue={minTempe} maximumValue={maxTempe}
              step={1}
              minimumTrackTintColor="red"
              maximumTrackTintColor="blue"
              tipProps={{ overlayClassName: 'foo' }}
              trackStyle={[{ backgroundColor: 'red', height: 10 }]}
              railStyle={ {backgroundColor: '#82caff', height: 10 }}
              onValueChange={this.onSliderChange}
              onSlidingComplete={this.onAfterChange}
        />
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