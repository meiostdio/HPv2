import { getArtList, getArticleList } from "./GithubData.js";
import { getThumbnails } from "./GithubData.js";

// ページ読み込み完了後に行う処理
// 記事のリストを読み込む関数を実行
window.onload = async function() {
  try {
    const articleList = await getArticleList();


    const artList = await getArtList();
    let main = document.getElementById("main");
    // ローディング表示を削除
    main.innerHTML = '';
    
    // 記事のキーを取得し、逆順でループ
    // DOMに記事を追加
    const articleKeys = Object.keys(artList).reverse();
    for (const key of articleKeys) {
      // 記事リストの情報を取得
      const article = artList[key];
      let articleNo = key;
      let title = article.title;
      let date = article.date;
      let tag = article.tag;
      let thumbnail = article.thumbnail;

      // サムネを取得
      let thumbnailDataBase64 = await getThumbnails(thumbnail);


      // サムネ以外のDOM要素を作成
      let articleDiv = document.createElement('list');
      // サムネ以外の情報を追加
      console.log(thumbnailDataBase64);
      articleDiv.innerHTML = `
        <a class="article" href="/articleViewer.html?id=${articleNo}">
          <h1>${title}</h1>
          <p>投稿日: ${date}</p>
          <p>タグ: ${tag.join(', ')}</p>
          <img class="thumbnail" src="data:image/;base64,${thumbnailDataBase64}">
          <hr />
        </a>
        `; // 各記事の間に区切り線を追加

      main.appendChild(articleDiv);
    }
  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }
};