import { getArtList } from "./GithubData.js";

// ページ読み込み完了後に行う処理
// 記事のリストを読み込む関数を実行
window.onload = function() {
  getArtList();
};