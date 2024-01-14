import { loginWithAuth0,logout,checkAuthState } from "./auth.js";
import { findAnchorElementId,getArticleContentElement } from "./articleViewer.js";
import { getArticleListElement } from "./articleIndex.js";

let loginBtn;
let userIcon;
let container = document.querySelector(".container");

// ページ読み込み完了後に行う処理
// 記事のリストを読み込む関数を実行
window.onload = async function() {
  //ヘッダー、フッターを読み込んで表示
  await fetchInclude();

  // ユーザー情報を格納する
  let user = await checkAuthState();
  // ユーザー情報が取得できている場合、ログインボタンをアイコンに変更
  if (user) {
    loginBtn.style.display = "none";
    userIcon.style.display = "block";
    userIcon.src = user.picture;
  }

  // URLにidがある場合、記事本文を取得
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get('id');
  console.log(articleId);
  if(articleId) {
    await showArticleContent(articleId);
    return
  }

  // URLにidがない場合記事リストを表示
  const articleListElement = await getArticleListElement();
  // ローディング表示を削除
  container.innerHTML = '';
  container.appendChild(articleListElement.card);
  container.appendChild(articleListElement.main);
};

// 記事クリックで記事本文を表示
async function showArticleContent(e) {
  let event;
  let articleId;

  if(typeof e === 'string'){
    articleId = e;
  } else {
    event = e;
    articleId = findAnchorElementId(event);
  }

  // URLの末尾にidを付与、リロードなし
  const currentUrl = new URL(window.location.href);
  currentUrl.searchParams.set('id', articleId);
  window.history.pushState({}, '', currentUrl);

  // 本文を取得して描画
  const articleContent = await getArticleContentElement(articleId);
  container.innerHTML = '';
  container.appendChild(articleContent);
}
window.showArticleContent = showArticleContent;

// auth.jsからログイン機能を呼び出す
async function login(e){
  await loginWithAuth0(e);
}
window.login = login;

// ログアウト機能
async function CallLogout(){
  await logout();
};
window.logout = CallLogout;

// サブメニュー開閉
function subMenu(){
  const subMenu = document.querySelector('.subMenu');
  if (subMenu.style.display === "none"){
    subMenu.style.display = "block";
  } else {
    subMenu.style.display = "none";
  }
}
window.subMenu = subMenu;

//　ヘッダー、フッター読み込み
export async function fetchInclude(){

  fetch('includes/header.html')
  .then((response) => response.text())
  .then((data) => document.querySelector('#header').innerHTML = data)
  .catch((error) => {
    console.error('ヘッダーファイルの読み込みに失敗しました', error);
  });

  fetch('includes/footer.html')
  .then((response) => response.text())
  .then((data) => document.querySelector('#footer').innerHTML = data)
  .catch((error) => {
    console.error('フッターファイルの読み込みに失敗しました', error);
  });;
}

// DOM読み込み完了後にリスナーの設定
window.addEventListener('DOMContentLoaded', async function() {
  let checkExist = setInterval(function() {
    if (document.getElementById('login')) {
      loginBtn = document.getElementById('login');
      userIcon = document.getElementById('userIcon');
      clearInterval(checkExist);
    }
  }, 50);  
})