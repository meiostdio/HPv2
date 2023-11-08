const { google } = require('googleapis');

module.exports = async (req, res) => {
  // クライアントの初期化
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'https://meiostdio.vercel.app/api/getGoogleDriveData'
  );

  // 認証フローの設定
  const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];
  const authUrl = client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  // ディレクトリとファイル名を引数から取得
  const directory = req.query.directory; // ディレクトリ名
  const fileName = req.query.fileName; // ファイル名

  try {
    // 認証フローの一部として、認証トークンを取得
    const code = req.query.code; // 認証コード（クライアントからのリダイレクトで取得）
    const { tokens } = await client.getToken(code);

    // 取得した認証トークンをセット
    client.setCredentials(tokens);

    // Google Drive APIクライアントの初期化
    const drive = google.drive({
      version: 'v3',
      auth: client,
    });

    // ファイルの検索
    const files = await drive.files.list({
      q: `name='${fileName}' and '${directory}' in parents`,
    });

    if (files.data.files.length === 0) {
      res.status(404).send('File not found');
    } else {
      // 最初の一致するファイルを取得
      const file = files.data.files[0];

      // ファイルのダウンロード
      const fileData = await drive.files.get(
        { fileId: file.id, alt: 'media' },
        { responseType: 'stream' }
      );

      // 画像データをクライアントに送信
      res.setHeader('Content-Type', file.mimeType);
      fileData.data.pipe(res);
    }
  } catch (error) {
    console.error('Error retrieving file:', error);
    res.status(500).send('Error retrieving file');
  }
};
