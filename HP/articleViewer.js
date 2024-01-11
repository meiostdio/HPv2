import { getImage } from "./GithubData.js";
import { fetchInclude } from "./main.js";
import { checkAuthState } from "./auth.js";

let urlParams = new URLSearchParams(window.location.search);
let articleId = urlParams.get('id');
let loginBtn;
let userIcon;

// DOM構築完了後に行う処理
document.addEventListener('DOMContentLoaded', async () => {
    //ヘッダー、フッターを読み込んで表示
    await fetchInclude();
    let checkExist = setInterval(function() {
        if (document.getElementById('login')) {
          loginBtn = document.getElementById('login');
          userIcon = document.getElementById('userIcon');
          clearInterval(checkExist);
        }
    }, 50);  
});

window.onload = async function() {
    // ユーザー情報を格納する
    let user = await checkAuthState();
    // ユーザー情報が取得できている場合、ログインボタンをアイコンに変更
    if (user) {
        loginBtn.style.display = "none";
        userIcon.style.display = "block";
        userIcon.src = user.picture;
    }

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
    let main = document.getElementById('main');
    main.innerHTML = '';

    // タイトル、タグ、日付を取得して表示
    const title = formattedData.title;
    const tag = formattedData.tag;
    const date = formattedData.date;
    main.innerHTML = `
        <h2 class="articleTitle">${title}</h2>
        <p class="date">作成日時：${date}<p>
        <p class="tag">${tag}</p>
    `;

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
            main.appendChild(img);

            let image = await getImage(articleId, value);
            img.src = `data:image/;base64,${image}`;
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
};
