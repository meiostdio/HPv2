import { loginWithAuth0, logout } from '../auth.js';

// auth.jsからログイン機能を呼び出す
export async function login(e){
    await loginWithAuth0(e);
    // await loginWithPopupAuth0();
}
window.login = login;

// ログアウト機能
export async function CallLogout(){
    await logout();
};
window.logout = CallLogout;

// 投稿ボタンクリックで記事投稿画面を表示
export function showArticlePost(){
    window.location.href = './articlePost/articlePost.html';
}
window.showArticlePost = showArticlePost;

// サブメニュー開閉
export function subMenu(){
    const subMenu = document.querySelector('.subMenu');
    if (subMenu.style.display === "none"){
        subMenu.style.display = "block";
    } else {
        subMenu.style.display = "none";
    }
}
window.subMenu = subMenu;