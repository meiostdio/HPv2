let urlParams = new URLSearchParams(window.location.search);
let articleId = urlParams.get('id');
window.onload = async function() {
    console.log(articleId);
};