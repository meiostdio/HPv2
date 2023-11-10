module.exports = async (req, res) => {
    const {google} = require('googleapis');

    const REDIRECT_URI = "https://meiostdio.vercel.app/";
    const oauth2client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        REDIRECT_URI
    )
    
    oauth2client.setCredentials({
        access_token: process.env.GOOGLE_ACCESS_TOKEN,
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    })



    try {
        const drive = google.drive({version: 'v3', auth: oauth2client});
        const response = await drive.files.list();
       } catch (error) {
        if (error.code === 401) {
          const newToken = await oauth2Client.getAccessToken();
          oauth2Client.setCredentials({
            access_token: newToken.token,
          });
        }
       }
    const drive = google.drive({version: 'v3', auth: oauth2client});

    const FOLDER_NAME = req.query.directoryName;
    const FILE_NAME = req.query.fileName;
    console.log('dire Name :', FOLDER_NAME);
    console.log('file name :', FILE_NAME);

    const folderResponse = await drive.files.list({
        q: `mimeType='application/vnd.google-apps.folder' and name='${FOLDER_NAME}'`,
        fields: 'files(id, name)',
      });
      const folderId = folderResponse.data.files[0].id;
    
    const fileResponse = await drive.files.list({
    q: `'${folderId}' in parents and name='${FILE_NAME}' and trashed = false`,
    fields: 'files(id, name)',
    });
    const files = fileResponse.data.files;

    if (files.length) {
        console.log('Files:');
        files.forEach((file) => {
        console.log(`${file.name} (${file.id})`);
        });
        res.status(200).json(files);
    } else {
        console.log('No files found.');
    }  
}