const { Octokit } = require('@octokit/rest');

module.exports = async (req, res) => {
  const owner = 'meiostdio';
  const repo = 'HPv2';
  const path = 'images/stdio.png';  // リポジトリ内の画像ファイルのパス

  // Vercelの環境変数からGitHubトークンを取得
  const token = process.env.GITHUB_API_KEY;

  // Octokitのセットアップ
  const octokit = new Octokit({ auth: `token ${token}` });

  try {
    // ファイルのコンテンツを取得
    const response = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });
    res.status(200).send({ content: response.data.content });
  } catch (error) {
    console.error('エラー:', error.message);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};
