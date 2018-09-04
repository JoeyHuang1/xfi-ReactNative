import ComcastConst from './ComcastConst.js'


async function setThermo (accessToken, seedId, value){
    let myInit = { method: 'PUT',
      body:JSON.stringify({attribSet:[{temperature:value}]}),
      headers: {...ComcastConst.comcast_headers, 
        'Authorization': 'Bearer '+accessToken}}
    let updateURL = ComcastConst.seedsURL+'/'+seedId+'/controls'

    try {
      let response = await fetch(updateURL,myInit);
      if (response.status===200)
        return Promise.resolve(response)
    } catch(e) {
      console.log(new Error(e))
    }
    return Promise.reject()
}

export default setThermo
