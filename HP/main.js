import { getArtList } from "./GithubData.js";

// ページ読み込み完了後に行う処理
// 記事のリストを読み込む関数を実行
window.onload = async function() {
  const artList = await getArtList();
  console.log(artList);
  let title = artList.item1[0].title;
  let date = artList.item1[0].date;
  let tag = artList.item1[0].tag;

  console.log(title);
  console.log(date);
  console.log(tag);

  console.log("onLoaded");
  let main = document.getElementById("main");
  

};