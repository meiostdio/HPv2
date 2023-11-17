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

    // 表示領域を取得しローディング表示を削除
    let main = document.getElementById('main');
    main.innerHTML = '';

    // タイトル、タグ、日付を取得して表示
    const title = formattedData.title;
    const tag = formattedData.tag;
    const date = formattedData.date;
    main.innerHTML = `
        <h2>${title}</h2>
        <p class="tag">${tag}</p>
        <p>作成日時:${date}<p>
    `;

    // JSONのセクション分繰り返し、動的に表示
    const articleKeys = Object.keys(formattedData).reverse();
    for (const key of articleKeys) {
        const section = formattedData[key];
        console.log(section);
        console.log(section.constent1);
    }


};