import ComcastConst from './ComcastConst.js'

function filterThermo(devices){
    let thermoList={}
    if (devices && devices.length>0) {
      devices.forEach(seed => {
        let attr={}
        if (seed[ComcastConst.attribSetAttr])
          attr=seed[ComcastConst.attribSetAttr][0]
        if (seed[ComcastConst.parent_type]===ComcastConst.parent_val && attr &&
            (attr[ComcastConst.hc_mode]===ComcastConst.heat_mode 
              || attr[ComcastConst.hc_mode]===ComcastConst.cool_mode)) {
          thermoList[seed.seedId]=
            {seedId: seed.seedId, name:seed.name, temperature:attr.temperature}
        }
      })
    }
    return thermoList
  }

  async function getThermoList(accessToken){
    let myInit = { method: 'GET',
      headers: {...ComcastConst.comcast_headers, 
        'Authorization': 'Bearer '+accessToken} };
    
    let thermoList = {}
    try {
      let response = await fetch(ComcastConst.seedsURL,myInit);
      let respObj = response.status===200? await response.json():{}
      thermoList = respObj? filterThermo(respObj.seeds): thermoList

    } catch(e) {
      console.log(new Error(e))
    }
    return thermoList
  }
  
  export default getThermoList
  export {filterThermo}