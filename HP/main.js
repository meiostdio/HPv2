import { getArtList } from "./GithubData.js";

// ページ読み込み完了後に行う処理
// 記事のリストを読み込む関数を実行
window.onload = async function() {
  const artList = await getArtList();
  console.log(artList);

  let title = artList.article1.title;
  let date = artList.article1.date;
  let tag = artList.article1.tag;

  let main = document.getElementById("main");
  
  main.innerHTML = `
    <h1>${title}</h1>
    <p>Date: ${date}</p>
    <p>Tags: ${tag.join(', ')}</p>
  `;
};