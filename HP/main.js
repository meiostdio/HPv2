import { getArticleList } from "./GithubData.js";
import { loginWithAuth0,getUser,getAuth0Client,logout } from "./auth.js";


let auth0Client;
let loginBtn;
let userIcon;

// ページ読み込み完了後に行う処理
// 記事のリストを読み込む関数を実行
window.onload = async function() {
  //ヘッダー、フッターを読み込んで表示
  fetchInclude();

  // ユーザー情報を格納する
  let user;
  auth0Client = await getAuth0Client();

  // URLを取得して末尾にパラメータが格納されているか確認
  // パラメータがある場合はログインできている
  const query = window.location.search;
  const shouldParseResult = query.includes("code=") && query.includes("state=");
  
  if (shouldParseResult) {
    // セッションを確立
    await auth0Client.handleRedirectCallback();
    // ユーザー情報を取得
    user = await getUser(auth0Client);
    console.log(user);
  }

  // ユーザー情報が取得できている場合、ログインボタンをアイコンに変更
  if (user) {
    loginBtn.style.display = "none";
    userIcon.style.display = "block";
    userIcon.src = user.picture;
  }

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
            <a class="article" href="/articleViewer.html?id=article${articleNo}">       
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

// auth.jsからログイン機能を呼び出す
async function login(){
  await loginWithAuth0(auth0Client);
}
window.login = login;

// ログアウト機能
async function CallLogout(){
  await logout(auth0Client);
};
window.logout = CallLogout;

// サブメニュー開閉
function subMenu(){
  const subMenu = document.querySelector('.subMenu');
  console.log(document.querySelector('.subMenu'));
  if (subMenu.style.display === "none"){
    subMenu.style.display = "block";
  } else {
    subMenu.style.display = "none";
  }
}
window.subMenu = subMenu;

//　ヘッダー、フッター読み込み
function fetchInclude(){
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

window.addEventListener('DOMContentLoaded', async function() {
  let checkExist = setInterval(function() {
    if (document.getElementById('login')) {
      loginBtn = document.getElementById('login');
      userIcon = document.getElementById('userIcon');
      clearInterval(checkExist);
    }
  }, 50);  
})