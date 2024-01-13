import { getArticleList } from "./GithubData.js";
import { loginWithAuth0,logout,checkAuthState } from "./auth.js";
import { findAnchorElementId,getArticle } from "./articleViewer.js";

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
  if(articleId) {
    await showArticleContent(articleId);
    return
  }

  // URLにidがない場合記事リストを表示
  try {
    // 記事リストを取得
    const articleList = await getArticleList();

    let main = document.getElementById("main");
    // ローディング表示を削除
    main.innerHTML = '';

    // 記事リストを投稿日順に表示するために逆順に変換
    const articleList_asc = Object.values(articleList.data.articles.items).reverse();

    articleList_asc.forEach((article, index) => {
      //記事No、タイトル、投稿日、タグ、サムネデータを変数に格納
      const articleNo = articleList_asc.length - (index);
      const title = article.title;
      const date = article.date;
      const tag = article.tag;
      const thumbImageBase64 = articleList.data.images.items[`article${articleNo}.txt`];

      // 追加する記事のHTMLを作成
      let articleDiv = document .createElement('list');
      articleDiv.innerHTML = `
        <div class="contents">
            <a class="article" id="article${articleNo}" onclick="showArticleContent(event)">       
            <img class="thumbnail" src="${thumbImageBase64}">
            <h1>${title}</h1>
            <p>投稿日: ${date}</p>
            <p>タグ: ${tag}</p>
          </a>
        </div>
      `;
      // main要素に記事を追加
      main.appendChild(articleDiv);
    })

  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }

};

// 記事クリックで本文を表示
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
  const articleContent = await getArticle(articleId);
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