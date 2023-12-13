import { getArticleList } from "./GithubData.js";
import { getUser } from "./auth.js";

// ページ読み込み完了後に行う処理
// 記事のリストを読み込む関数を実行
window.onload = async function() {
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
            <a class="article" href="/articleViewer.html?id=article${articleNo}">        <img class="thumbnail" src="${thumbImageBase64}">
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

// ログインボタンにリスナーを設定
const loginBtn = document.getElementById('login').querySelector('button');
loginBtn.addEventListener('click', login);

// auth.jsでログイン機能を呼び出す
function login(){
  console.log('main.js login');
  getUser();
}