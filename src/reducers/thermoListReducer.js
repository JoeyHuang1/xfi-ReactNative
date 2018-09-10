import update from 'react-addons-update';

const thermoListReducer = function(state, action) {
  let newState=state
  if (state === undefined) {
    newState = {thermos:[]};
  }
  if (action.type === 'GOT_SEEDS') {
    newState={...state, 'thermos':action.seeds};
  }


  if ('SET_TEMPE_DONE'===action.type){
    newState.thermos[action.seed.seedId].temperature=action.seed.temperature
    // Fix Android slider sluggish problem. Use above line and comment out below.
    // Don't want redux be aware of this change to trigger new render to ThermoList
    // Otherwise, it will also re-render slider that makes slider non-responding
    // in Android from time to time after one sliding

    //let seedIdAttr =action.seed.seedId
    //let newVal={'thermos':{}}
    //newVal.thermos[seedIdAttr]={'temperature':{$set: action.seed.temperature}}
    //newState=update(state, newVal);
  }

  return newState;
}

export default thermoListReducer