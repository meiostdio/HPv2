import { getImage } from "./GithubData";

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
    formattedData.section.forEach(async sec => {
        const type = sec.type;
        const value = sec.value;
        const sectionDev = document.createElement('dev');
        if(type == "subtitle"){
            sectionDev.innerHTML = `
                <h3>${value}</h3>
            `;
        } else if(type == "content"){
            sectionDev.innerHTML = `
                <p>${value}</p>
            `;
        } else if(type == "image"){
            let image = await getImage(value);
            sectionDev.innerHTML = `
                <img src=${image}
            `;
        } else if(type == "code"){
            sectionDev.innerHTML = `
                <p class="code">${value}</p>
            `;
        } else if(type == "reference"){
            sectionDev.innerHTML = `
                <p>${value}</p>
            `;
        }
        main.appendChild(sectionDev);

    });
};
