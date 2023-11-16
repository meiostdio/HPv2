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

export function getArtList(){
    
}

window.getGithubData = getGithubData;