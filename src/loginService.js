import CryptoJS from "crypto-js"
import ComcastConst from './ComcastConst.js'

  function getLoginPostData (account, password){
    let hash = CryptoJS.SHA256(password+account+ComcastConst.pwdEncodePostfix); 
    let pwdEncode =hash.toString(CryptoJS.enc.Base64)
    let postData =JSON.stringify({emailAddress:account, 
      password:pwdEncode})
     return postData
  }

  async function goLogin (account, password){
    let postData = getLoginPostData(account, password)
    var myInit = { method: 'POST',
      headers: ComcastConst.comcast_headers,
      body:postData
    };
    
    let respObj={}
    try {
      let response = await fetch(ComcastConst.loginURL,myInit);
      respObj = response.status===200? await response.json():{}
      if (respObj.access_token)
        return Promise.resolve(respObj)
    } catch(e) {
      console.log(new Error(e))
    }
    return Promise.reject()
  }
  
  export default goLogin
  export {getLoginPostData}