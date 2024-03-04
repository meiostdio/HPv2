import { getImage } from "./GithubData.js";
import { saveArticleImageWithExpire } from "./cache.js";

// let urlParams = new URLSearchParams(window.location.search);

let article_main;

// 親要素のaタグのIdを取得する
export function findAnchorElementId(e) {
    let currentElement = e.target;
    // 最初の <a> 要素を見つけるまで親要素をたどる
    while (currentElement !== null && currentElement.tagName !== 'A') {
        currentElement = currentElement.parentElement;
    }
    return currentElement.id;
}

// Githubから記事本文を取得する
export async function getArticleContentElement(id) {
    let articleId = id;
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

    // 表示領域を取得しローディング表示を削除
    article_main = document.createElement('div');
    article_main.id = 'article_main';
    let main = document.createElement('main');
    main.id = 'main';

    // タイトル、タグ、日付、ユーザー情報を取得して表示
    const title = formattedData.title;
    const tag = formattedData.tag;
    const date = formatDate(formattedData.date);
    let user;
    let picture;
    if(formattedData.user && formattedData.picture){ 
        user = formattedData.user;
        picture = formattedData.picture;
        main.innerHTML = `
            <h2 class="articleTitle">${title}</h2>
            <div class="article-info">
                <img src=${picture} alt="ユーザー画像" class="user-picture">
                <div class="name-date-tag">
                    <p class="user-name">${user}</p>
                    <div class="date-tag">
                        <p class="date">${date}<p>
                        <p class="tag">${tag}</p>
                    </div>
                </div>
            </div>
        `;
    } else {
        main.innerHTML = `    
            <h2 class="articleTitle">${title}</h2>
            <div class="article-info">
                <p class="date">作成日時：${date}<p>
                <p class="tag">${tag}</p>
            </div>
        `;
    }

    // JSONのセクション分繰り返し、動的に表示
    formattedData.section.forEach(async (sec) => {
        const type = sec.type;
        const value = sec.value;
        let url;

        // URLがある場合、変数に格納
        if (sec.url){
            url = sec.url;
        }
        
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
            const img = document.createElement('img');
            img.className = "article-image";
            main.appendChild(img);
            let image = await getImage(articleId, value);
            img.src = `data:image/;base64,${image}`;
            // localStorageにbase64の画像データを格納
            saveArticleImageWithExpire(articleId, value, img.src, 10);
        } else if(type == "code"){
            sectionDev.innerHTML = `
                <pre class="src"><code>${value}</code></pre>
            `;
        } else if(type == "reference"){
            sectionDev.innerHTML = `
                <p>${value}</p>
            `;
        } else if(type == "link"){
            sectionDev.innerHTML = `
                <a href=${url} target="_blank">${value}</a>
            `;
        }
        main.appendChild(sectionDev);
    });
    article_main.appendChild(main);
    return article_main
};

function formatDate(dateString) {
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    const day = dateString.slice(6, 8);

    return `${year}/${month}/${day}`;
}