// /api/getGithubToken.js
module.exports = (req, res) => {
    // 環境変数からGitHub APIトークンを取得
    const apikey = process.env.GOOGLE_API_KEY;
    const clientid = process.env.GOOGLE_CLIENT_ID;
    const folderid = process.env.GOOGLE_IMAGE_FOLDER_ID;
    
    // ステータスコード200で、トークンを含むJSONを返す
    res.status(200).json({ apikey,clientid, folderid });
  };
  