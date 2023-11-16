import { getArtList } from "./GithubData.js";

// ページ読み込み完了後に行う処理
// 記事のリストを読み込む関数を実行
window.onload = async function() {
  const artList = await getArtList();
  console.log(artList);

  let artListArray = Array.from(artList);
  console.log(artListArray);
  artListArray.forEach(data => {
    console.log(data.title);
  });
  // let title = artList.item1[0].title;
  // let date = artList.item1[0].date;
  // let tag = artList.item1[0].tag;

  let main = document.getElementById("main");
  
  main.innerHTML = `
    <h1>${title}</h1>
    <p>Date: ${date}</p>
    <p>Tags: ${tag.join(', ')}</p>
  `;
};