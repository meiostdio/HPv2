// /api/getGithubToken.js
module.exports = (req, res) => {
    // 環境変数からGitHub APIトークンを取得
    const token = process.env.GITHUB_API_TOKEN;
    
    // ステータスコード200で、トークンを含むJSONを返す
    res.status(200).json({ token });
  };
  