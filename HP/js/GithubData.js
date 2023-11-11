async function fetchData(){
    try{
        const resposne = await fetch('https://meiostdio.vercel.app/api/getGithubData')
        .then(resposne => resposne.json())
        .then(data =>{
            console.log(data);
        })
    } catch(error) {
        console.error(error);
    }
}

function getGithubData(){
    fetchData();
}

window.getGithubData = getGithubData;