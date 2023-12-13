
// Auth0のセットアップ
async function getAuth0Client(){
    console.log('getAuth0Client');
    const auth0Client = await auth0.createAuth0Client({
        domain: 'mieiostdio.jp.auth0.com',
        client_id: '3NKELeme13IvWgricfnixqOjIzt23KD5',
        redirect_uri: 'http://localhost:3000',
    });
    return auth0Client
}

// main.jsから呼び出される関数
// ログインボタンが押されたら呼び出される
async function getUser(){
    console.log('auth.js getUser()');
    const auth0Client = await getAuth0Client();
    auth0Client.loginWithPopup();
}

// 関数をエクスポート
export { getUser };