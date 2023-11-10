async function getGoogleDriveData(directoryName, fileName) {
    try {
      const response = await fetch(`/api/getGoogleDriveData?directoryName=${encodeURIComponent(directoryName)}&fileName=${encodeURIComponent(fileName)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
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
    console.log('directory Name is:',directoryName);
    console.log('file Name is :', fileName);
    getGoogleDriveData(directoryName,fileName);
}
window.searchImageInFolder = searchImageInFolder;
