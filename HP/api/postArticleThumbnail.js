const { Octokit } = require("@octokit/rest");

// GitHubのAPIキーを環境変数から取得
const token = process.env.GITHUB_API_KEY;

// Octokitのインスタンスを作成
const octokit = new Octokit({ auth: token });

module.exports = async (req, res) => {
    // リクエストのボディから必要な情報を取得
    const { articleNumber, thumbnailBase64 } = req.body;

    // ファイルパスを作成
    const filePath = `images/thumbnails/${articleNumber}.txt`;
    console.log('Request:', req.body);
    console.log(thumbnailBase64);
    try {
        // GitHubにファイルを作成または更新
        await octokit.rest.repos.createOrUpdateFileContents({
            owner: "meiostdio",
            repo: "HPv2",
            path: filePath,
            message: "Add thumbnail from Vercel serverless function",
            content: Buffer.from(thumbnailBase64, 'utf-8').toString('base64'),
        });

        // 成功レスポンスを返す
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("ファイル作成または更新エラー: ", error.message);
        // エラーレスポンスを返す
        res.status(500).json({ success: false, error: error.message });
    }

};