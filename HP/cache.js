// 期限付きlocalStorageラッパー
const ExpiringLocalStorage = {

    // 保存用メソッド  
    saveWithExpire: (key, value, expirationInMinutes) => {
  
      // 期限を計算
      const now = new Date();
      const expiry = new Date(now.getTime() + expirationInMinutes * 60 * 1000);
  
      // 文字列と期限をオブジェクトにラップする
      const item = {
        value,
        expiry 
      };
  
      // JSONにエンコードして保存
      localStorage.setItem(key, JSON.stringify(item));
    },
  
    // 取得時は期限もチェックする
    getWithExpire: (key) => {
  
      const item = JSON.parse(localStorage.getItem(key));
  
      // 期限切れならnullを返す
      if (!item || Date.now() > item.expiry) {
        return null;
      }
  
      return item.value;
    }
  }
  
  
  // 使用例
  ExpiringLocalStorage.saveWithExpire('key', 'hello', 10); 
  
  const value = ExpiringLocalStorage.getWithExpire('key');