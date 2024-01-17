// コンテナ要素保存用メソッド  
export function saveContainerElementWithExpire (key, container, expirationInMinutes) {

  // 期限を計算
  const now = new Date();
  const expiry = new Date(now.getTime() + expirationInMinutes * 60 * 1000);
  
  // img要素内のbase64文字列を削除する
  const containerCopy = container.cloneNode(true);
  const imgElements = containerCopy.querySelectorAll('img');
  imgElements.forEach(img => {
    img.removeAttribute('src');
  });

  const containerHTML = containerCopy.outerHTML;
  // 文字列と期限をオブジェクトにラップする
  const item = {
    containerHTML,
    expiry 
  };

  // JSONにエンコードして保存
  localStorage.setItem(key, JSON.stringify(item));
}

// サムネ画像保存用
export function saveThumbImageWithExpire (key, imageBase64, expirationInMinutes) {
  // 期限を計算
  const now = new Date();
  const expiry = new Date(now.getTime() + expirationInMinutes * 60 * 1000);

  const item = {
    imageBase64,
    expiry
  };

  localStorage.setItem(key, JSON.stringify(item));
}

// 記事内画像保存用
export function saveArticleImageWithExpire (key, imageName, imageBase64, expirationInMinutes) {
  // 期限を計算
  const now = new Date();
  const expiry = new Date(now.getTime() + expirationInMinutes * 60 * 1000);

  // 引数から取得した画像名から拡張子を削除
  const dotIndex = imageName.lastIndexOf(".");
  const baseName = dotIndex !== -1 ? imageName.substring(0, dotIndex) : imageName;
  
  // articleIdと画像名を足してkeyにする
  const newKey = key + "-" + baseName;

  const item = {
    imageBase64,
    expiry
  };

  localStorage.setItem(newKey, JSON.stringify(item));
}

// 取得時は期限もチェックする
export function getWithExpire(key) {
  const item = JSON.parse(localStorage.getItem(key));

  // 期限切れならnullを返す
  if (!item || Date.now() > item.expiry) {
    return null;
  }

  return item.jsonValue;
}

// 表示するページのデータが格納されているか確認する
export function checkCachesExpire(isIndex, key) {
  let item;
  // 記事リストか記事本文中の画像かチェック
  if(isIndex) {
    // 記事リストの場合keyが1から20までキャッシュにアクセスしていく
    // 途中で期限切れがある場合中断してfalse
    // エラーが出るまで繰り返しが出来た場合はtrue
    for(let i = 1; i <= 10; i++) {
      console.log("key: ", i);
      item = JSON.parse(localStorage.getItem(i));
      // 期限切れならfalseを返す
      if (!item || Date.now() > item.expiry) {
        return false;
      }
    }
  } else {
    // 本文中のデータの場合画像が1つでもあり、有効期限内であればtrue
    item = JSON.parse(localStorage.getItem(key + "-article1"));
    if (!item || Date.now() > item.expiry) {
      return false;
    }
  }
  return true;
}