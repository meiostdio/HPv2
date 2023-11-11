module.exports = async (req, res) => {
    const {google} = require('googleapis');
    // set ciletn infomation
    const REDIRECT_URI = "https://meiostdio.vercel.app/";
    const oauth2client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        REDIRECT_URI
    )

    // set Oauth2 Credentitials
    oauth2client.setCredentials({
        access_token: process.env.GOOGLE_ACCESS_TOKEN,
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    })

    // check access_token available
    // if access_token is not available try it reactivate
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
    
    let folderId;
    let filesData;
    
    // Find folder id using folder name
    try {
        const folderResponse = await drive.files.list({
                q: `mimeType='application/vnd.google-apps.folder' and name = '${FOLDER_NAME}'`,
                fields: 'files(id, name)',
            });

        if(folderResponse.data.files.length){
            folderId = folderResponse.data.files[0].id;
            } else {
                res.status(404).send('Folder not found.');
            }
    } catch (error){
        if(error.code === 401) {
            res.status(401).send('Unauthorized.');
          } else if (error.code === 403) {
            res.status(403).send('Forbidden.');
          } else {
            res.status(500).send('Internal Server Error.');
          }
    } 
    
    // Find file data using folder id
    try {
        const fileResponse = await drive.files.list({
            q: `'${folderId}' in parents and name contains '${FILE_NAME}' and trashed = false`,
            fields: 'files(id, name)',
            });
        if (fileResponse.data.files.length){
            filesData = fileResponse.data.files;
        } else {
            res.status(404).send('File not found.');
        }
    } catch (error) {
        if (error.code === 401) {
            res.status(401).send('Unauthorized.');
          } else if (error.code === 403) {
            res.status(403).send('Forbidden.');
          } else {
            res.status(500).send('Internal Server Error.');
          }
    }

    if (filesData) {
        res.status(200).json(filesData);
    } else {
        console.log('There was a problem with the fetch oparation.');
    }  
}