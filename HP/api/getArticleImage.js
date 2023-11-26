const { Octokit }  = require('@octokit/rest');

module.exports = async (req, res) => {
  const directoryName = req.query.directoryName;
  const fileName = req.query.fileName;
  const owner = 'meiostdio';
  const repo = 'HPv2';
  const path = `images/${directoryName}/${fileName}`;
  
  // Vercelの環境変数からGitHubトークンを取得
  const token = process.env.GITHUB_API_KEY;

  // Octokitのセットアップ
  const octokit = new Octokit({ auth: `token ${token}` });
  try {
    // ファイルの内容を取得
    const response = await octokit.repos.getContent({
      owner, 
      repo,
      path
    });

    // 画像データを取得
    const content = response.data.content;

    // Base64エンコードされた画像データをそのまま返す
    res.status(200).json({ image: content });
    
    } catch (error) {
      console.error('エラー:', error.message);
      res.status(500).send({ error: 'Internal Server Error' });
    }
   }