const { Octokit } = require('@octokit/rest');

module.exports = async (req, res) => {

  const dirPath = 'images/thumbnails';
  const owner = 'meiostdio';
  const repo = 'HPv2';  

  const token = process.env.GITHUB_API_KEY;

  const octokit = new Octokit({ auth: `token ${token}` });

  try {
    const listFilesResponse = await octokit.repos.getContent({
      owner, 
      repo,
      path: dirPath,
      per_page: 100 // 1回で100件取得
    });

    const imagePaths = listFilesResponse.data.map(file => file.path);
    
    // 100ファイルずつgetContentする
    const responses = [];
    for(let i = 0; i < imagePaths.length; i+=100) {
      const paths = imagePaths.slice(i, i+100);  
      const res = await octokit.repos.getContent({
        owner, 
        repo,
        paths  
      })
      responses.push(res);
    }

    // 結果をまとめる 
    let images = [];
    responses.forEach(res => {
      images = images.concat(res.data.map(d => d.content));  
    });

    res.status(200).json({images});

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({error: 'Internal Server Error'}); 
  }  
}