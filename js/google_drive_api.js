async function getGoogleToken(){
    try{
        const response = await fetch('/api/getGoogleToken');
        const data = await response.json();
        folderiD = data.folderid;
        apikey = data.apikey;
        clientid = data.clientid;
    } catch (error) {
        console.error('Error:', error);
    }
}

function initClient() {
    gapi.client.setApiKey(apikey);
    gapi.client.load('drive', 'v3').then(() => {
    });
  }

export function searchImageInFolder() {
    const imageName = document.getElementById('imageName').value;
    gapi.client.drive.files.list({
        q: `'${folderiD}' in parents and name='${imageName}'`,
        fields: 'files(id, name, webContentLink)'
    }).then((response) => {
        const files = response.result.files;
        if (files && files.length > 0) {
        loadDriveImage(files[0].id);
        } else {
        console.log('No files found.');
        }
    });
}

function loadDriveImage(fileId) {
    var request = gapi.client.drive.files.get({
    'fileId': fileId,
    'fields': 'webContentLink'
});

request.execute((resp) => {
    var downloadUrl = resp.webContentLink;
    document.getElementById('driveImage').src = downloadUrl;
});
}

window.searchImageInFolder = searchImageInFolder;
let folderiD = null;
let apikey = null;
let clientid = null;
try{
    const token = await getGoogleToken();
    gapi.load('client', function(){ 
        initClient()
    }
    );
} catch (error) {
    console.log('Faild to get Google API token:', error);
}
