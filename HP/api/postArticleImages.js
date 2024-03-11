const { Octokit } = require("@octokit/rest");
const jwt = require('jsonwebtoken');

// GitHubのAPIキーを環境変数から取得
const token = process.env.GITHUB_API_KEY;

// Octokitのインスタンスを作成
const octokit = new Octokit({ auth: token });

// Vercelのサーバーレス関数
module.exports = async (req, res) => {
    // リクエストのボディから必要な情報を取得
    const { articleNumber, imagesBase64 } = req.body;
    console.log("articleNumber:", articleNumber);

    // 認証に使用する変数
    let isAuthenticated;
    const pem = process.env.AUTH0_PEM;
    const authToken = req.headers.authorization.split(' ')[1];

    if(!authToken) {
        // ヘッダーにAuthorizationがない場合はエラーを返す
        res.status(401).send({ success: false, message: '認証されたユーザーではありません。' });
    }
    // ユーザーの検証
    const decoded = await new Promise((resolve, reject) => {
        jwt.verify(authToken, pem, { algorithms: ['RS256'] }, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
                isAuthenticated = true;
                console.log('postimage:' ,decoded);
            }
        });
    });

    if (!isAuthenticated) {
        // 認証エラーのレスポンスを返す
        res.status(401).send({ success: false, message: '認証されたユーザーではありません。' });
    }

    // // 画像を一時的に保存するディレクトリを作成
    const directoryPath = `images/${articleNumber}`;
    try {
        for (let i = 0; i < imagesBase64.length; i++) {
            let imageName = `article${i + 1}.png`;

            // 画像をディレクトリに保存
            const imagePath = `${directoryPath}/${imageName}`;

            // Base64エンコードされた画像データからプレフィックスを削除
            const match = imagesBase64[i].match(/^data:image\/png;base64,(.+)$/);
            if (!match) {
                throw new Error('Invalid image data');
            }
            const data = match[1];  // プレフィックスを削除したBase64データ
        
            // GitHubに画像をアップロード
            await octokit.rest.repos.createOrUpdateFileContents({
                owner: "meiostdio",
                repo: "HPv2",
                path: `images/${articleNumber}/article${i + 1}.png`,
                message: "Add image from Vercel serverless function",
                content: data,
            });
        }
    // レスポンスを返す
    res.status(200).json({ success: true });
    } catch (error) {
        console.error("画像アップロードエラー: ", error.message);
        // エラーレスポンスを返す
        res.status(500).json({ success: false, error: error.message });
    }
};