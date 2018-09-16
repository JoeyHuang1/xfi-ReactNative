import update from 'immutability-helper';

const thermoListReducer = function(state, action) {
  let newState=state
  if (state === undefined) {
    newState = {thermos:[]};
  }
  if (action.type === 'GOT_SEEDS') {
    newState={...state, 'thermos':action.seeds};
  }


  if ('SET_TEMPE_DONE'===action.type){
    // this update temperature of one thermo only
    // But ThermoList props is based on the thermos array
    // so it still trigger render of ThermoList and all Thermo
    // So need thermo shouldComponentUpdate() to filter some render
    // Otherwise, it's sluggish in Android
    newState=update(state, {thermos:{[action.seed.seedId]:
        {temperature:{$set: action.seed.temperature}}}});
  }

  return newState;
}

export default thermoListReducer