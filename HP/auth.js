
// Auth0のセットアップ
async function getAuth0Client(){
    const auth0Client = await auth0.createAuth0Client({
        domain: 'mieiostdio.jp.auth0.com',
        clientId: '3NKELeme13IvWgricfnixqOjIzt23KD5'
    });
    return auth0Client
}

// ログイン画面を開きAuth0認証機能を呼び出す
async function loginWithAuth0(){
    const auth0Client = await getAuth0Client();
    await auth0Client.loginWithRedirect({
        authorizationParams: {
            redirect_uri: window.location.origin
          }
    });
}

async function getUser(client){
    const auth0Client = client;
  
    // まずは認証済みかチェック
    const isAuthenticated = await auth0Client.isAuthenticated();
  
    // 認証済みの場合のみgetUserを呼び出す
    if(isAuthenticated){
      const user = await auth0Client.getUser(); 
      return user;
    }
  
    return null;
  }


// 関数をエクスポート
export { getUser,loginWithAuth0,getAuth0Client };