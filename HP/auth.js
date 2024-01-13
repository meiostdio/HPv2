let auth0Client = await getAuth0Client();

// Auth0のセットアップ(初期状態)
async function getAuth0Client(){
    const auth0Client = await auth0.createAuth0Client({
        domain: 'mieiostdio.jp.auth0.com',
        clientId: '3NKELeme13IvWgricfnixqOjIzt23KD5'
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
          redirect_uri: baseURI
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

async function checkAuthState() {
  // URLを取得して末尾にパラメータが格納されているか確認
  // パラメータがある場合はログインできている
  const query = window.location.search;
  const shouldParseResult = query.includes("code=") && query.includes("state=");
  let user;
  if (shouldParseResult) {
    // セッションを確立
    const redirectResult = await auth0Client.handleRedirectCallback();
    setTokenToCookie(redirectResult);
    console.log(JSON.stringify(redirectResult.access_token));
    // ユーザー情報を取得
    user = await getUser(auth0Client);
    console.log(user);
    return user
  }
  return null
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

// クッキーにトークンを保存
async function setTokenToCookie(result) {
  const redirectResult = result;
  const accessToken = await auth0Client.getTokenSilently();
  // 有効期限を1時間に制限
  const expires = new Date(Date.now() + 21600000); 

  document.cookie = `authToken=${accessToken}; 
                  expires=${expires};
                  httpOnly;
                  Secure;
                  SameSite=Strict`;

  console.log(accessToken);
}

function getAuthTokenFromCookie() {
  const tokenMatch = document.cookie.match(new RegExp('authToken=([^;]+)'));
  return tokenMatch ? tokenMatch[1] : null; 
}

// 関数をエクスポート
export { getUser,loginWithAuth0,getAuth0Client,logout,checkAuthState };