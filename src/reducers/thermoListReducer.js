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
    let seedIdAttr =action.seed.seedId
    let newVal={'thermos':{}}
    newVal.thermos[seedIdAttr]={'temperature':{$set: action.seed.temperature}}
    newState=update(state, newVal);
  }

  return newState;
}

export default thermoListReducer