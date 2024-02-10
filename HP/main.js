import { loginWithAuth0,logout,checkAuthState,getAuth0Client } from "./auth.js";
import { findAnchorElementId,getArticleContentElement } from "./articleViewer.js";
import { getArticleListElement } from "./articleIndex.js";
import { checkCachesExpire, getCache, removeExpiredCache, saveContainerElementWithExpire, saveURLState } from "./cache.js";

let loginBtn;
let userIcon;
let container = document.querySelector(".container");

// ページ読み込み完了後に行う処理
// 記事のリストを読み込む関数を実行
window.onload = async function() {
  //ヘッダー、フッターを読み込んで表示
  await fetchInclude();

  // セッションストレージに履歴を保存
  saveURLState();

  // 古いキャッシュを削除
  removeExpiredCache();
  console.log("古いキャッシュを削除しました");
  
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
  if(articleId) {
    await showArticleContent(articleId);
    return

  } else {
    // URLにidがない場合記事リストを表示
    
    // 有効期限のキャッシュがあるかどうか確認
    if(checkCachesExpire(true)){
      console.log("記事リストのキャッシュは", true);

      // 記事リスト要素、サムネを取得
      const item = getCache(true);
      container.innerHTML = item.listElement.containerHTML;

      const imgs = container.querySelectorAll('img');
      const imgsLength = imgs.length;
      imgs.forEach((img, index) => {
        img.src = item.thumbBase64[imgsLength - index];
      });

    } else {
      console.log("記事リストのキャッシュは", false);
      // キャッシュがない場合はAPIから取得して表示
      const articleListElement = await getArticleListElement();
      // ローディング表示を削除
      container.innerHTML = '';
      container.appendChild(articleListElement.card);
      container.appendChild(articleListElement.main);
      
      // 記事リストの要素をlocalStorageに保存
      saveContainerElementWithExpire('articleList', container, 10);
    }
  }
  

  // 期限切れのキャッシュを削除する
  removeExpiredCache();
};

// URLが変更されたときに発火するイベント
window.addEventListener('urlChange', function(e) {
  saveURLState();
});

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

  const isCacheValid = checkCachesExpire(false, articleId);
  console.log("記事本文のキャッシュは" ,isCacheValid);
  
  // キャッシュがある場合は取得して表示
  if(isCacheValid){
    const articleContent = getCache(false, articleId);
    container.innerHTML = articleContent.articleElement.containerHTML;
    const imgs = container.querySelectorAll('img');
    const imgsLength = imgs.length;
    imgs.forEach((img, index) => {
      img.src = articleContent.images[index + 1];
    });
  }

  // URLの末尾にidを付与、リロードなし
  const currentUrl = new URL(window.location.href);
  currentUrl.searchParams.set('id', articleId);
  window.history.pushState({}, '', currentUrl);

  // カスタムイベントを発火
  const urlChangeEvent = new CustomEvent('urlChange', { detail: currentUrl });
  window.dispatchEvent(urlChangeEvent);

  // 本文を取得して描画
  const articleContent = await getArticleContentElement(articleId);
  container.innerHTML = '';
  container.appendChild(articleContent);

  // キャッシュに保存
  saveContainerElementWithExpire(articleId, container, 10);
}
window.showArticleContent = showArticleContent;

// headerのロゴクリックで記事リストを表示
async function showArticleList() {
  // URLの末尾のidを削除
  const currentUrl = new URL(window.location.href);
  currentUrl.searchParams.delete('id');
  window.history.pushState({}, '', currentUrl);

  // カスタムイベントを発火
  const urlChangeEvent = new CustomEvent('urlChange', { detail: currentUrl });
  window.dispatchEvent(urlChangeEvent);

  const articleListElement = await getArticleListElement();
  // ローディング表示を削除
  container.innerHTML = '';
  container.appendChild(articleListElement.card);
  container.appendChild(articleListElement.main);
  
  // 記事リストの要素をlocalStorageに保存
  saveContainerElementWithExpire('articleList', container, 10);
}
window.showArticleList = showArticleList;


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

// 投稿ボタンクリックで記事投稿画面を表示
function showArticlePost(){
  window.location.href = './articlePost/articlePost.html';
}
window.showArticlePost = showArticlePost;

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

// ブラウザバックの禁止
// history.pushState(null, null, location.href);
window.addEventListener('popstate', (e) => {
  // 戻るボタンが押された場合
  if(e.state) { 

  } else {
    // 進むボタンが押された場合
  }
});