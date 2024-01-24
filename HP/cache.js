// 記事リストコンテナ要素保存用メソッド  
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

// 表示するページのデータが格納されているか確認する
export function checkCachesExpire(isList, key) {
  let item;
  // 記事リストか記事本文中の画像かチェック
  if(isList) {
    // 記事リストをgetItemして期限をチェック
    item = JSON.parse(localStorage.getItem('articleList'));
    if(item === null) {
      return false
    }
    const expiryDate = new Date(item.expiry)
    // 期限切れならfalseを返す
    if (new Date > expiryDate) {
      return false;
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

export function getCache(isList, key){
  // 記事リストの場合は記事リストの要素とサムネを全て取得してreturn
  if(isList) {
    const listElement = JSON.parse(localStorage.getItem('articleList'));
    let thumbBase64 = {};
    for(let i = 1; i <= 10; i ++) {
      let item = JSON.parse(localStorage.getItem(i));
      thumbBase64[i] = item.imageBase64;
    } 
    const item = {
      listElement,
      thumbBase64
    };
    return item
  } else {
    // 本文の場合は本文のコンテナ要素と記事内画像を取得してreturn
    const articleElement = JSON.parse(localStorage.getItem(key));
    let images = {};
    let item = {};
    for(let i = 1;; i ++){
      let item = JSON.parse(localStorage.getItem(`${key}-article${i}`));
      if(item === null){
        break;
      }
      images[i] = item.imageBase64;
    }
    item = {
      images,
      articleElement
    };
    return item
  }
}

// 期限切れのキャッシュを削除する
export function cleanCache() {

  // localStorageのすべてのキーを取得
  const keys = Object.keys(localStorage);

  // 現在の時刻を取得
  const now = new Date();

  // 期限切れのアイテムを削除する
  keys.forEach(key => {
    const item = JSON.parse(localStorage.getItem(key));

    if (item && item.expiry && new Date(item.expiry) < now) {
      localStorage.removeItem(key);
    }
  });
}

export function saveURLState(uri) {
  try {
    const Url =  new URL(window.location.href);
    const currentUrl = Url.toString();
  
    // セッションストレージにURLを格納
    const storedURLs = sessionStorage.getItem('history') || '[]';
    const urlArray = JSON.parse(storedURLs);
    urlArray.push(currentUrl);
    sessionStorage.setItem('history', JSON.stringify(urlArray));
  } catch (e) {
    console.log(e);
  }
  
}