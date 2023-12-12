//import { createAuth0Client } from "../node_modules/@auth0/auth0-spa-js";


let auth0;

// Auth0のセットアップ
async function setupAuth0(){
    console.log('testest');
    auth0 = await createAuth0Client({
        domain: 'mieiostdio.jp.auth0.com',
        client_id: '3NKELeme13IvWgricfnixqOjIzt23KD5',
        redirect_uri: window.location.origin,
    });
}

// 帰ってきた認証の結果を処理
async function handleRedirectCallback() {
    await auth0.handleRedirectCallback();
    const user = await auth0.getUser();

    // ログイン成功時の処理
    console.log('Logged in user:', user);
}

// main.jsから呼び出される関数
// ログインボタンが押されたら呼び出される
export async function login(){
    console.log('test');
    await setupAuth0();
    await handleRedirectCallback();
}
