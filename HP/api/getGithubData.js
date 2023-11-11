module.exports = async (req, res) => {
    const apiKey = process.env.GITHUB_API_KEY;
    const url = 'https://api.github.com/repos/meiostdio/HPv2/contents/HP'; // GitHub APIのエンドポイント
   
    const response = await fetch(url, {
      headers: {
        'Authorization': `token ${apiKey}`,
      },
    });
   
    const data = await response.json();
    res.setHeader('Content-Type', 'application/json; charset=utf-8').send(data);
   };
   