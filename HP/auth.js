let auth0Client = await getAuth0Client();
let token;
// Auth0のセットアップ(初期状態)
export async function getAuth0Client(){
    const auth0Client = await auth0.createAuth0Client({
        domain: 'mieiostdio.jp.auth0.com',
        clientId: '3NKELeme13IvWgricfnixqOjIzt23KD5',
        cacheLocation: 'localstorage'
    });
    return auth0Client
}

// ログイン画面を開きAuth0認証機能を呼び出す
export async function loginWithAuth0(e){
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
export async function getUser(client){
    const auth0Client = client;
    const user = await auth0Client.getUser(); 
    if(user){
      return user;
    }
    return null;
}

// ログイン状態を確認,認証済みの場合はユーザー情報を取得してreturn
export async function checkAuthState() {
  console.log('checkAuthState');
  let isAuthenticated = auth0Client.isAuthenticated();
  
  const shouldParseResult = window.location.search.includes("code=") && window.location.search.includes("state=");

  if(isAuthenticated){
    await auth0Client.getTokenSilently();
    token = await auth0Client.getTokenSilently();
    console.log('token:', token);
    console.log('isAuthenticated is true');
    return await getUser(auth0Client);
  } else {
    if(shouldParseResult){
      console.log('shouldParseResult is true');
      await auth0Client.handleRedirectCallback();
      isAuthenticated = await auth0Client.isAuthenticated();
      token = await auth0Client.getTokenSilently();
      console.log('token', token);
      return await getUser(auth0Client);
    } else {
      console.log('shouldParseResult is false');
      return null;
    }
  }
}

// ログアウト
export async function logout(){
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
