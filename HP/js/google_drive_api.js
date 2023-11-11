async function getGoogleDriveData(directoryName, fileName) {
    try {
      const response = await fetch(`/api/getGoogleDriveData?directoryName=${encodeURIComponent(directoryName)}&fileName=${encodeURIComponent(fileName)}`);
      switch (response.status) {
        case 200:
          const data = await response.json();
        case 401:
          throw new Error('Unauthorized.');
        case 403:
          throw new Error('Forbidden.');
        case 404:
          throw new Error('No files found.');
        case 500:
          throw new Error('Internal Server Error.');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('ERROR:', error);
      return null;
    }
  }
  

export function searchImageInFolder(){
    const directoryName = document.getElementById('directoryName').value;
    const fileName = document.getElementById('fileName').value;
    const files_data = getGoogleDriveData(directoryName,fileName);
    console.log('files_data :',files_data);
}
window.searchImageInFolder = searchImageInFolder;
