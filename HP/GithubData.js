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

// GraphQLを使用して記事リスト、サムネを一括取得する
export async function getArticleList(){
    try{
        const response = await fetch('/api/getArticleList');
        const data = await response.json();
        console.log('記事リスト:', data);
        return data
    } catch (error) {
        console.error('記事リスト取得エラー(GraphQL): ', error);
        return null
    }
}