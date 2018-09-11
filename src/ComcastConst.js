const headers={'Content-Type': 'application/json', 'x-stringify-version': '2.0'}
Object.freeze(headers)

const ComcastConst={
    loginURL: 'https://api.stringify.com/v2/login',
    comcast_headers:headers,
    pwdEncodePostfix :'stringify',
    seedsURL:'https://api.stringify.com/v2/seeds',
    attribSetAttr:'attribSet',
    parent_type:'myHubRosetta',
    heat_mode:'heat',
    cool_mode:'cool',
    hc_mode:'mode',
    parent_val :'w1qUpEDz_1',
    accessCookie:'accessToken',

    // asyncStorage key
    keepLogin:'keepLogin',
    remember:'remember',
    rememberId:'rememberId',
    rememberName:'rememberName',
    loginAccessToken: 'loginAccessToken',
}
Object.freeze(ComcastConst)

export default ComcastConst
