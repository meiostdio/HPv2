let auth0Client = await getAuth0Client();

// Auth0のセットアップ(初期状態)
async function getAuth0Client(){
    const auth0Client = await auth0.createAuth0Client({
        domain: 'mieiostdio.jp.auth0.com',
        clientId: '3NKELeme13IvWgricfnixqOjIzt23KD5',
        cacheLocation: 'localstorage'
    });
    return auth0Client
}

// ログイン画面を開きAuth0認証機能を呼び出す
async function loginWithAuth0(e){
  const baseURI = e.target.baseURI;
  console.log(baseURI);
  console.log(window.location.origin)
  await auth0Client.loginWithRedirect({
      authorizationParams: {
          redirect_uri: baseURI,
          scope: 'offline_access'
        }
  });
}

// ユーザー情報を取得してreturn
async function getUser(client){
    const auth0Client = client;
    const user = await auth0Client.getUser(); 
    if(user){
      return user;
    }
    return null;
}

async function checkAuthState() {
  console.log('checkAuthState');
  // let isAuthenticated = auth0Client.isAuthenticated();
  
  // const shouldParseResult = window.location.search.includes("code=") && window.location.search.includes("state=");

  // if(isAuthenticated){
  //   if(shouldParseResult){
  //     console.log('shouldParseResult is true');
  //     await auth0Client.handleRedirectCallback();
  //     isAuthenticated = await auth0Client.isAuthenticated();
  //     return await getUser(auth0Client);
  //   } else {
  //     console.log('isAuthenticated is false');
  //     return null;
  //   }
  // }
  try {
    const token = await auth0Client.getTokenSilently();
    console.log('User is authenticated');

    return await getUser(auth0Client);
  } catch (error) {
    console.log('User is not authenticated');
    return null;
  }
}

// ログアウト
async function logout(){
  try {
    await auth0Client.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  } catch (error) {
    console.log('Logout faild: ', error);
  }
}


// 関数をエクスポート
export { getUser,loginWithAuth0,getAuth0Client,logout,checkAuthState };