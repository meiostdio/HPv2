
// Auth0のセットアップ(初期状態)
async function getAuth0Client(){
    const auth0Client = await auth0.createAuth0Client({
        domain: 'mieiostdio.jp.auth0.com',
        clientId: '3NKELeme13IvWgricfnixqOjIzt23KD5'
    });
    return auth0Client
}

// ログイン画面を開きAuth0認証機能を呼び出す
async function loginWithAuth0(client){
    const auth0Client = client;
    await auth0Client.loginWithRedirect({
        authorizationParams: {
            redirect_uri: window.location.origin
          }
    });
}

// ユーザー情報を取得してreturn
async function getUser(client){
    const auth0Client = client;
  
    // まずは認証済みかチェック
    const isAuthenticated = await auth0Client.isAuthenticated();
    if(isAuthenticated){
      const user = await auth0Client.getUser(); 
      return user;
    }
    return null;
}

// ログアウト
async function logout(client){
  let auth0Client = client;
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
export { getUser,loginWithAuth0,getAuth0Client,logout };