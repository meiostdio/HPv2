let urlParams = new URLSearchParams(window.location.search);
let articleId = urlParams.get('id');
window.onload = async function() {
    console.log(articleId);
    let artData;
    try {
        const response = await fetch(`/api/getArticle?id=${articleId}`);
        const data = await response.json();
        artData = data.content;
    } catch (error) {
        console.error('データ取得エラー:', error.message);
    }

    // 記事データをデコードする
    let decodedData = atob(artData);
    let utf8Decoder = new TextDecoder('utf-8');
    decodedData = utf8Decoder.decode(new Uint8Array(decodedData.split('').map(c => c.charCodeAt(0))));
    let formattedData = JSON.parse(decodedData);
    console.log(formattedData);
};