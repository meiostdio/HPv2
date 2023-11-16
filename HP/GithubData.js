async function fetchData() {
    const api_url = '/api/getGithubData';
    try {
        const response = await fetch(api_url);
        const data = await response.json();
        const imageData = data.content;
        console.log(imageData);
        return imageData;
    } catch (error) {
        console.error('データの取得エラー:', error.message);
        return null;
    }
}

async function getGithubData(){
    const imageData = await fetchData();
    if (imageData) {
        const imageElemnt = document.getElementById('image');
        console.log(imageData);
        // 画像の読み込み完了後に実行されるコード
        imageElemnt.onload = () => {
            console.log('画像の読み込みが完了しました。');
        };
        // 画像の読み込みをトリガーする
        imageElemnt.src = `data:image/png;base64,${imageData}`;
        
    }
}

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

window.getGithubData = getGithubData;