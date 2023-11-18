import { getArtList } from "./GithubData.js";
import { getImage } from "./GithubData.js";

// ページ読み込み完了後に行う処理
// 記事のリストを読み込む関数を実行
window.onload = async function() {
  try {
    const artList = await getArtList();
    let main = document.getElementById("main");
    // ローディング表示を削除
    main.innerHTML = '';

    // 記事のキーを取得し、逆順でループ
    // DOMに記事を追加
    const articleKeys = Object.keys(artList).reverse();
    for (const key of articleKeys) {
      const article = artList[key];
      let articleNo = key;
      let title = article.title;
      let date = article.date;
      let tag = article.tag;

      let articleDiv = document.createElement('div');
      articleDiv.innerHTML = `
        <a class="article" href="/articleViewer.html?id=${articleNo}">
          <h1>${title}</h1>
          <p>投稿日: ${date}</p>
          <p>タグ: ${tag.join(', ')}</p>
          <hr />
        </a>
        `; // 各記事の間に区切り線を追加

      main.appendChild(articleDiv);
    }
  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }
};