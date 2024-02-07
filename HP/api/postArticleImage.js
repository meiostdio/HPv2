const { Octokit } = require("octokit");
const fs = require("fs");

// GitHubのAPIキーを環境変数から取得
const token = process.env.GITHUB_API_KEY;

// Octokitのインスタンスを作成
const octokit = new Octokit({ auth: token });

// Vercelのサーバーレス関数
module.exports = async (req, res) => {
    try {
        // リクエストのボディから必要な情報を取得
        const { articleNumber, imageName, imageBase64 } = req.body;

        // 画像を一時的に保存するディレクトリを作成
        const directoryPath = `images/${articleNumber}`;
        fs.mkdirSync(directoryPath, { recursive: true });

        // 画像をディレクトリに保存
        const imagePath = `${directoryPath}/${imageName}`;
        fs.writeFileSync(imagePath, Buffer.from(imageBase64, "base64"));

        // GitHubに画像をアップロード
        const response = await octokit.rest.repos.createOrUpdateFileContents({
            owner: "meostdio",
            repo: "HPv2",
            path: imagePath,
            message: "Add image",
            content: fs.readFileSync(imagePath, "base64"),
        });

        // レスポンスを返す
        res.status(200).json({ success: true, data: response.data });
    } catch (error) {
        // エラーレスポンスを返す
        res.status(500).json({ success: false, error: error.message });
    }
};