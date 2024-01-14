
// 保存用メソッド  
export function saveWithExpire (key, value, expirationInMinutes) {

  // 期限を計算
  const now = new Date();
  const expiry = new Date(now.getTime() + expirationInMinutes * 60 * 1000);
  const jsonValue = JSON.stringify(value);
  // 文字列と期限をオブジェクトにラップする
  const item = {
    jsonValue,
    expiry 
  };

  // JSONにエンコードして保存
  localStorage.setItem(key, JSON.stringify(item));
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