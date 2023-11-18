const { Octokit }  = require('@octokit/rest');

module.exports = async (req, res) => {
  const id = req.query.id;
  const owner = 'meiostdio';
  const repo = 'HPv2';
  const dirPath = 'images';
  const path = `images/${id}`;  // リポジトリ内の画像ファイルのパス

  // Vercelの環境変数からGitHubトークンを取得
  const token = process.env.GITHUB_API_KEY;

  // Octokitのセットアップ
  const octokit = new Octokit({ auth: `token ${token}` });
  try {
      // ディレクトリの内容を取得
      const response = await octokit.repos.getContent({
        owner,
        repo,
        dirPath,
      });

      // ディレクトリ内のすべてのファイルを取得
      const files = response.data.filter(item => item.type === 'file');

      // ファイル名の完全一致でファイルを特定
      const targetFile = files.find(file => file.name === id);
      
      if (targetFile) {
          // ファイルのコンテンツを取得
          const contentResponse = await octokit.repos.getContent({
            owner,
            repo,
            path: targetFile.path,
          });
          res.status(200).send({ content: contentResponse.data.content });
      } else {
          res.status(404).send({ error: 'File not found' });
      }
    } catch (error) {
      console.error('エラー:', error.message);
      res.status(500).send({ error: 'Internal Server Error' });
    }
   }