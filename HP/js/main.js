async function fetchImageFromGithub(TOKEN, Name) {
    const owner = 'meiostdio';
    const repo = 'HPv2';

    const token = TOKEN;

    const imageName = Name;
    const path = 'images/' + imageName;

    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const config = {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3.raw'
      },
      responseType: 'arraybuffer'
    };

    try {
        const response = await axios.get(url, config);
        const imageBase64 = arrayBufferToBase64(response.data);
        const imageElement = document.getElementById('githubImage');
        imageElement.src = `data:image/png;base64,${imageBase64}`;
      } catch (error) {
        console.error('Failed to download image:', error);
      }
      
  }
  
  function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  async function getGithubToken() {
    try {
      const response = await fetch('/api/getGithubToken');
      const data = await response.json();
      return data.token
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function buttonCliked() {
    const imageName = document.getElementById('imageName').value;
    try{
      const API_TOKEN = await getGithubToken();
      fetchImageFromGithub(API_TOKEN, imageName);
    } catch (error) {
      console.error('Failed to get API token:', error);
    }
    
  }

