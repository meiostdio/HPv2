// サーバーから記事のリストを受け取りデコード、パースする
export async function getArtList(){
    try {
        const response = await fetch("/api/getArtList");
        const data = await response.json();
        const list = data.content;

        //デコード、パース
        let decodedData = atob(list);
        let utf8Decoder = new TextDecoder('utf-8');
        decodedData = utf8Decoder.decode(new Uint8Array(decodedData.split('').map(c => c.charCodeAt(0))));
        let formattedData = JSON.parse(decodedData);
        return formattedData
    } catch (error) {
        console.error('データの取得エラー:', error.message);
        return null;
    }
}

// 記事に使用する画像を取得する
export async function getImage(directoryName, fileName){
    const dirName = directoryName;
    const imageName = fileName;
    try {
        const response = await fetch(`/api/getArticleImage?directoryName=${dirName}&fileName=${imageName}`);
        const data = await response.json();
        const imageBase64 = data.image;
         return imageBase64
    } catch (error) {
        console.error('画像データ取得エラー: ', error.message);
        return null;
    }
}

// 記事リストに追加するサムネを一括で取得する
export async function getThumbnails(){
    try{
        const response = await fetch('/api/getThumbnails');
        const data = await response.json();
        // JSONオブジェクトに変換
        const imagesJson = images.map(imgBase64 => {
        // ファイル名を取得  
        const fileName = imgBase64.split(';')[1].split('=')[1];
        return {
        name: fileName,
        data: imgBase64
        };
  
  });
    } catch (error) {
        console.error('サムネ取得エラー:',error.message);
        return null
    }
}