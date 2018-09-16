import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  normalText:{
    fontSize: 16,
  },
  thermo:{
    marginTop:10,

  },
  input:{
    margin:5,
    height:44,
    fontSize: 16,
    borderBottomWidth: 1,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  loginSwitch:{
    margin:3
  },
  loginSaveOpt:{
    flexDirection:'row', 
    alignItems:'center'
  },
  slider:{
    height:44 
  },
  thermoTitle:{
    flexDirection:'row'
  },
  thermo: {
    flex:1
  }
});

export default styles
