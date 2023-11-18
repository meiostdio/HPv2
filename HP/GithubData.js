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

// 記事に使用する画像を取得してデコードする
export async function getArticleImage(id){
    const imageId = id;
    try {
        const response = await fetch(`/api/getArticleImage?id=${imageId}`);
        const data = await response.json();
        const imageData = data.content;
        
        // デコード
        let decodedImageData = atob(imageData);
         return decodedImageData
    } catch (error) {
        console.error('画像データ取得エラー: ', error.message);
        return null;
    }
}
