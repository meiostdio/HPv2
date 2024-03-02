import { getArticleList } from "./GithubData.js";
import { saveThumbImageWithExpire } from "./cache.js";

export async function getArticleListElement() {
    

    const card = document.createElement('div');
    card.id = 'leftcolumm-title';
    
    const pText = document.createElement('p');
    pText.appendChild(document.createTextNode('新着記事'));
    card.appendChild(pText);

    let main = document.createElement('main');
    main.id = 'main';
    try {
        // 記事リストを取得
        const articleList = await getArticleList();

        // 記事リストを投稿日順に表示するために逆順に変換
        const articleList_asc = Object.values(articleList.data.articles.items).reverse();

        articleList_asc.forEach((article, index) => {
        //記事No、タイトル、投稿日、タグ、サムネデータを変数に格納
        const articleNo = articleList_asc.length - (index);
        const title = article.title;
        const date = article.date;
        const tag = article.tag;
        let picture;
        let user;
        if(article.picture && article.user){
            picture = article.picture;
            user = article.user;
            console.log(picture);
            console.log(user);
        }
        const thumbImageBase64 = articleList.data.images.items[`article${articleNo}.txt`];
        
        // localStorageに画像データを格納
        saveThumbImageWithExpire(articleNo, thumbImageBase64, 10);

        // 追加する記事のHTMLを作成
        let articleDiv = document .createElement('list');
        if(picture && user){
            console.log('picture and name');
            articleDiv.innerHTML = `
            <div class="contents">
                <a class="article" id="article${articleNo}" onclick="showArticleContent(event)">       
                <img class="thumbnail" src="${thumbImageBase64}">
                <h1>${title}</h1>
                <p>投稿日: ${date}</p>
                <p>タグ: ${tag}</p>
                <div class="author">
                    <img class="author-picture" src="${picture}">
                    <p>${user}</p>
                </div>
                </a>
            </div>
            `;
        } else {
            articleDiv.innerHTML = `
                <div class="contents">
                    <a class="article" id="article${articleNo}" onclick="showArticleContent(event)">       
                    <img class="thumbnail" src="${thumbImageBase64}">
                    <h1>${title}</h1>
                    <p>投稿日: ${date}</p>
                    <p>タグ: ${tag}</p>
                    </a>
                </div>
            `;
        }
        // main要素に記事を追加
        main.appendChild(articleDiv);
        
        })
        return { card: card, main: main}

    } catch (error) {
        console.error("Error fetching or processing data:", error);
    }
}