// 記事に使用する画像を取得する
export async function getImage(directoryName, fileName){
    const dirName = directoryName;
    const imageName = fileName;
    try {
        const response = await fetch(`/api/getArticleImage?directoryName=${dirName}&fileName=${imageName}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const data = await response.json();
        const imageBase64 = data.image;
         return imageBase64
    } catch (error) {
        console.error('画像データ取得エラー: ', error.message);
        return null;
    }
}

// GraphQLを使用して記事リスト、サムネを一括取得する
export async function getArticleList(){
    try{
        const response = await fetch('/api/getArticleList', {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const data = await response.json();
        return data
    } catch (error) {
        console.error('記事リスト取得エラー(GraphQL): ', error);
        return null
    }
}

// 記事データをVercelサーバーレス関数を使用してGitHubに保存する
export async function postArticleContent(jsonData, token){
    try{
        const response = await fetch('/api/postArticleContent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            },
            body: JSON.stringify(jsonData),
        });
        const data = await response.json();
        return data.success
    } catch (error) {
        console.error('記事データ保存エラー: ', error);
        return null
    }
}

// 記事に使用する画像をVercelサーバーレス関数を使用してGitHubに保存する
export async function postArticleImage(articleNumber, imagesBase64, token){
    try{
        const response = await fetch('/api/postArticleImages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ articleNumber, imagesBase64 }),
        });
        const data = await response.json();
        return data.success
    } catch (error) {
        console.error('画像データ保存エラー: ', error);
        return null
    }
}

// 記事サムネイルをVercelサーバーレス関数を使用してGitHubに保存する
export async function postArticleThumbnail(articleNumber, thumbnailBase64, token){
    try{
        const response = await fetch('/api/postArticleThumbnail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ articleNumber, thumbnailBase64 }),
        });
        const data = await response.json();
        return data.success
    } catch (error) {
        console.error('サムネイルデータ保存エラー: ', error);
        return null
    }
}