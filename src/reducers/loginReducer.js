
const loginReducer = function(state, action) {
  let newState=state
  if (state === undefined) {
    newState = {};
  }
  if (action.type === 'LOGIN') {
    newState={...state, ...action.user};
  }
  return newState;
}

export default loginReducer