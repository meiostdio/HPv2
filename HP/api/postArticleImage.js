const { Octokit } = require("@octokit/rest");
const fs = require("fs");

// GitHubのAPIキーを環境変数から取得
const token = process.env.GITHUB_API_KEY;

// Octokitのインスタンスを作成
const octokit = new Octokit({ auth: token });

// Vercelのサーバーレス関数
module.exports = async (req, res) => {
    let sha = '';
    // リクエストのボディから必要な情報を取得
    const { articleNumber, imageName, imageBase64 } = req.body;
    console.log("articleNumber:", articleNumber, "imageName:" ,imageName);

    // 画像を一時的に保存するディレクトリを作成
    const directoryPath = `images/${articleNumber}`;
    fs.mkdirSync(directoryPath, { recursive: true });

    // 画像をディレクトリに保存
    const imagePath = `${directoryPath}/${imageName}`;

    // Base64エンコードされた画像データからプレフィックスを削除し、画像形式を取得
    const match = imageBase64.match(/^data:(.+);base64,(.+)$/);
    if (!match) {
        throw new Error('Invalid image data');
    }
    const format = match[1].split('/')[1];  // "png", "jpeg"など
    const data = match[2];  // プレフィックスを削除したBase64データ

    // 画像をバイナリ形式で保存
    fs.writeFileSync(imagePath, Buffer.from(data, "base64"));

    console.log('directoryPath', directoryPath);
    // 既存のファイルがある場合は、shaを取得してアップロード
    try {
        const { data } = await octokit.rest.repos.getContent({
            owner: "meiostdio",
            repo: "HPv2",
            path: directoryPath,
        });
        sha = data.sha;

        const response = await octokit.rest.repos.createOrUpdateFileContents({
            owner: "meiostdio",
            repo: "HPv2",
            path: imagePath,
            message: "Add image from Vercel serverless function",
            content: fs.readFileSync(imagePath, "base64"),
            sha: sha,
        });

        req.status(200).json({ success: true });
        return;
        
    } catch (error) {
        console.error("既存のファイルは存在しません: ", error.message);
    }

    // 既存のファイルがない場合はディレクトリを作成してアップロード
    try {
        // GitHubに画像をアップロード
        const response = await octokit.rest.repos.createOrUpdateFileContents({
            owner: "meiostdio",
            repo: "HPv2",
            path: imagePath,
            message: "Add image from Vercel serverless function",
            content: fs.readFileSync(imagePath, "base64"),
        });
        console.log('path', imagePath);

        // レスポンスを返す
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("画像アップロードエラー: ", error.message);
        // エラーレスポンスを返す
        res.status(500).json({ success: false, error: error.message });
    }
};