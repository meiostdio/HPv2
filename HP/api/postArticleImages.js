const { Octokit } = require("@octokit/rest");
const fs = require("fs");

// GitHubのAPIキーを環境変数から取得
const token = process.env.GITHUB_API_KEY;

// Octokitのインスタンスを作成
const octokit = new Octokit({ auth: token });

// Vercelのサーバーレス関数
module.exports = async (req, res) => {
    // リクエストのボディから必要な情報を取得
    const { articleNumber, imagesBase64 } = req.body;
    console.log("articleNumber:", articleNumber);

    // // 画像を一時的に保存するディレクトリを作成
    const directoryPath = `images/${articleNumber}`;
    fs.mkdirSync(directoryPath, { recursive: true });
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

            // 画像をバイナリ形式で保存
            fs.writeFileSync(imagePath, Buffer.from(data, "base64"));
        
            // GitHubに画像をアップロード
            await octokit.rest.repos.createOrUpdateFileContents({
                owner: "meiostdio",
                repo: "HPv2",
                path: imagePath,
                message: "Add image from Vercel serverless function",
                content: fs.readFileSync(imagePath, "base64"),
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