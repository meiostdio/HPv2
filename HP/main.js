import { checkAuthState } from "./auth.js";
import { findAnchorElementId,getArticleContentElement } from "./articleViewer.js";
import { getArticleListElement } from "./articleIndex.js";
import { checkCachesExpire, getCache, removeExpiredCache, saveContainerElementWithExpire } from "./cache.js";

let loginBtn;
let userIcon;
let container = document.querySelector(".container");

// ページ読み込み完了後に行う処理
// 記事のリストを読み込む関数を実行
window.onload = async function() {
  //ヘッダー、フッターを読み込んで表示
  await fetchInclude();

  // 古いキャッシュを削除
  removeExpiredCache();
  console.log("古いキャッシュを削除しました");
  
  // MutationObserverのインスタンスを作成,ログインボタンとユーザーアイコンの監視
  const observer = new MutationObserver(async function(mutations) {
    // 変更が発生したときに実行されるコールバック
    loginBtn = document.getElementById('login');
    userIcon = document.getElementById('userIcon');
    if (loginBtn && userIcon) {
      // loginBtnとuserIconが存在する場合、監視を終了
      observer.disconnect();

      // ユーザー情報を格納する
      let user = await checkAuthState();
      console.log('user', user);
      // ユーザー情報が取得できている場合、ログインボタンをアイコンに変更
      if (user) {
        loginBtn.style.display =  "none";
        userIcon.style.display = "block";
        userIcon.src = user.picture;
      }
    }
  });

  // body要素の子要素の変更を監視開始
  observer.observe(document.body, { childList: true, subtree: true });

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

      const imgs = container.querySelectorAll('.thumbnail');
      const imgsLength = imgs.length;
      imgs.forEach((img, index) => {
        console.log(imgsLength - index);
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
