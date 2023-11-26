const { Octokit } = require('@octokit/rest');

module.exports = async (req, res) => {
  const imageName = req.query.imageName;
  console.log(imageName);
  const dirPath = `images/thumbnails/${imageName}`;
  console.log(dirPath);
  const owner = 'meiostdio';
  const repo = 'HPv2';  

  // vercel環境変数からGithubトークンを取得
  const token = process.env.GITHUB_API_KEY;

  // トークンをデータ取得ライブラリにセット
  const octokit = new Octokit({ auth: `token ${token}` });

  try {
    const response = await octokit.repos.getContent({
      owner, 
      repo,
      path: dirPath,
    });

    const content = response.data.content;
    res.status(200).json({image: content});

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({error: 'Internal Server Error'}); 
  }  
}