

// ページ読み込み完了後に行う処理
// 記事のリストを読み込む関数を実行
window.onload = function() {
  setTimeout(function() {
    const main = document.querySelector("main");
    main.innerText = "ページロード完了";
  }, 3000);
};